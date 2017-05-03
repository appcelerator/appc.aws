'use strict'

exports.findAll = function (Model, callback) {
  this._invoke(Model, 'findAll', arguments)
}
