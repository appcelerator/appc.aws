const Mingo = require('mingo')
const async = require('async')
const crypto = require('crypto')
const _ = require('lodash')
// these values don't really need to be secret since we're just using
// for reversible Id->value
const secret = Buffer.from('3e8d8bfb8dce9eae55907067010891be', 'hex')

function S3ObjectConnector(Arrow, S3, connector) {
  this.Arrow = Arrow
  this.S3 = S3
  this.connector = connector
}

function encodePK(bucket, key) {
  var plaintext = JSON.stringify({ bucket: bucket, key: key })
  var cipher = crypto.createCipheriv('aes128', secret, secret)
  var cipherText = cipher.update(plaintext, 'utf-8', 'base64')
  cipherText += cipher.final('base64')
  return cipherText
}

function decodePK(ciphertext) {
  var buf = Buffer.from(ciphertext, 'base64')
  var decipher = crypto.createDecipheriv('aes128', secret, secret)
  var plaintext = decipher.update(buf)
  plaintext += decipher.final('utf-8')
  return JSON.parse(plaintext)
}

S3ObjectConnector.prototype.create = function (Model, values, callback) {
  var params = {}
  Object.keys(Model.fields)
    .filter(function (k) {
      return !Model.fields[k].readonly
    })
    .forEach(function (k) {
      var field = Model.fields[k]

      if (typeof values[field.name || k] !== 'undefined') {
        params[field.name || k] = values[field.name || k]
      }
    })

  this.S3.putObject(params, function (err, result) {
    if (err) { return callback && callback(err) }
    if (result) {
      var instance = Model.instance(values, true)
      instance.set('etag', result.ETag, true)
      instance.setPrimaryKey(encodePK(params.Bucket, values.name))
      callback && callback(null, instance)
    } else {
      return callback && callback()
    }
  })
}

S3ObjectConnector.prototype.delete = function (Model, instance, callback) {
  this.S3.deleteObject({ Bucket: instance.get('bucket'), Key: instance.get('name') }, function (err, result) {
    if (err) { return callback && callback(err) }
    callback && callback(null, instance)
  })
}

S3ObjectConnector.prototype.findOne = function (Model, id, callback) {
  var json = decodePK(id)
  return this.query(Model, { where: { bucket: json.bucket, name: json.key }, limit: 1 }, callback)
}

S3ObjectConnector.prototype.findAll = function (Model, callback) {
  return callback(new Error('findAll not supported, use query instead'))
}

S3ObjectConnector.prototype.query = function (Model, options, callback) {
  const where = options.where || {}
  const self = this
  const params = {
    Bucket: where.bucket || where.Bucket,
    MaxKeys: 1000
  }

  this.S3.listObjects(params, function (err, result) {
    if (err) { return callback && callback(err) }
    const instances = []
    const max = options.limit || 1000

    if (result && result.Contents && result.Contents.length) {
      async.map(result.Contents, function (object, cb) {
        // TODO: support pagination
        if (instances.length >= max) {
          return cb()
        }
        // unfortunately we have to call head to get all the object details
        self.S3.headObject({ Bucket: params.Bucket, Key: object.Key }, function (err, o) {
          if (err) {
            return cb(err)
          }

          var instance = Model.instance(object, true)
          instance.set(o, true)
          instance.set('name', object.Key)
          instance.set('bucket', params.Bucket)
          instance.setPrimaryKey(encodePK(params.Bucket, object.Key))
          var tasks = []
          if (where.acl) {
            tasks.push(function (next) {
              // we have an acl filter, we need to fetch it since it's not on the object by default
              self.S3.getObjectAcl({ Bucket: params.Bucket, Key: object.Key }, function (err, acl) {
                if (err) {
                  return cb(err)
                }

                if (acl) {
                  var value = 'private'
                  acl.Grants.forEach(function (grant) {
                    if (grant.Permission === 'READ' && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers') {
                      value = 'public-read'
                    }
                  })
                  instance.set('acl', value)
                }
                next(null, instance)
              })
            })
          }
          if (tasks.length) {
            async.parallel(tasks, function (err) {
              cb(err, instance)
            })
          } else {
            cb(null, instance)
          }
        })
      }, function (err, instances) {
        if (err) { return callback && callback(err) }
        if (instances && instances.length) {
          var collection = new self.Arrow.Collection(Model, _.compact(instances))
          if (options.where) {
            var cursor = Mingo.find(collection, options.where)
            // if the counts are different, we have different results so we need to filter
            if (cursor.count() !== collection.length) {
              instances = []
              while (cursor.hasNext()) {
                instances.push(cursor.next())
              }
              collection = new self.Arrow.Collection(Model, instances)
            }
          }
          if (options.limit === 1) {
            callback && callback(err, collection[0])
          } else {
            callback && callback(err, collection)
          }
        } else {
          callback && callback()
        }
      })
    } else {
      callback && callback()
    }
  })
}

S3ObjectConnector.prototype.getSignedUrl = function (Model, instance, params) {
  params = { Bucket: instance.get('bucket'), Key: instance.get('name'), Expires: (params && (params.Expires || params.expires)) || 900 }
  return this.S3.getSignedUrl('getObject', params)
}

module.exports = S3ObjectConnector
