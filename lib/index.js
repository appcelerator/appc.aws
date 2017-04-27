var _ = require('lodash'),
	async = require('async'),
	path = require('path'),
	crypto = require('crypto'),
	AWS = require('aws-sdk'),
	pkginfo = require('pkginfo')(module) && module.exports,
	S3,
	cache = {};

// --------- appc.aws connector -------
exports.create = function(Arrow, server) {
	var Connector = Arrow.Connector,
		Collection = Arrow.Collection,
		Instance = Arrow.Instance;

	// return a Connector Class
	return Connector.extend({
		/*
		 Configuration.
		 */
		pkginfo: _.pick(pkginfo, 'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'),
		logger: server && server.logger || Arrow.createLogger({}, { name: pkginfo.name }),

		// if you need to do this dynamically to load models, call this method after connect but before your callback
		// and set the models value on your connector instance
		models: Arrow.loadModelsForConnector(pkginfo.name, module),

		/**
		 * this method is called before the server starts to allow the connector to connect to any external
		 * resources if necessary (such as a Database, etc.).
		 * @param callback
		 */
		connect: function(callback) {
			this.logger.debug('connecting');
			AWS.config.update(this.config);
			this.logger.debug('connected');
			callback();
		},
		/**
		 * this method is called before shutdown to allow the connector to cleanup any resources
		 * @param callback
		 */
		disconnect: function(callback) {
			this.logger.debug('disconnecting');
			this.logger.debug('disconnected');
			callback();
		},

		/*
		 Metadata.
		 */

		/**
		 * Provides metadata to be used to validate the config.
		 * @param callback
		 */
		fetchMetadata: function(callback) {
			callback(null, {
				fields: [
					Arrow.Metadata.URL({
						name: 'accessKeyId',
						description: 'the accessKeyId for your account',
						required: true
					}),
					Arrow.Metadata.Text({
						name: 'secretAccessKey',
						description: 'the secretAccessKey for your account',
						required: true
					}),
					Arrow.Metadata.Text({
						name: 'region',
						description: 'region',
						required: false
					}),
					Arrow.Metadata.Checkbox({
						name: 'sslEnabled',
						default: true,
						description: 'use SSL or not'
					}),
					Arrow.Metadata.Integer({
						name: 'maxRetries',
						default: 10,
						description: 'the maximum of retries when using the AWS API'
					})
				]
			});
		},

		_invoke: function(Model, method, args) {
			try {
				var connector = getAWSConnector(Arrow, this, Model);
				return connector[method].apply(connector,args);
			}
			catch (E) {
				var callback = args[args.length-1];
				if (callback && _.isFunction(callback)) {
					return callback(E);
				}
				else {
					throw E;
				}
			}
		},

		create: function (Model, values, callback) {
			this._invoke(Model,'create',arguments);
		},
		findAll: function (Model, callback) {
			this._invoke(Model,'findAll',arguments);
		},
		findOne: function (Model, id, callback) {
			this._invoke(Model,'findOne',arguments);
		},
		query: function (Model, options, callback) {
			this._invoke(Model,'query',arguments);
		},
		save: function (Model, instance, callback) {
			this._invoke(Model,'save',arguments);
		},
		'delete': function (Model, instance, callback) {
			this._invoke(Model,'delete',arguments);
		},
		deleteAll: function (Model, callback) {
			this._invoke(Model,'deleteAll',arguments);
		},

		// special methods
		getSignedUrl: function(Model, instance, params) {
			return this._invoke(Model, 'getSignedUrl', arguments);
		}
	});
};

function getAWSConnector(Arrow, connector, Model) {
	var name = Model.name,
		found = cache[name];
	if (found) { return found.connector; }
	if (name.indexOf('S3')===0) {
		AWS.config = connector.config;
		S3 = S3 || new AWS.S3();
		var object = name.substring(2),
			Connector = require(path.join(__dirname,'S3'+object+'Connector.js'));
		cache[name] = found = {
			name: 'S3',
			object: object,
			instance: S3,
			connector: new Connector(Arrow,S3,connector)
		};
	}
	return found && found.connector;
}

