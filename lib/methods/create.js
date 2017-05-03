'use strict'

exports.create = function (Model, values, callback) {
  this._invoke(Model, 'create', arguments)
}
