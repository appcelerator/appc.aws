'use strict'

exports.query = function (Model, options, callback) {
  this._invoke(Model, 'query', arguments)
}
