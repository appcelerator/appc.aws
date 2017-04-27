'use strict'

exports.findOne = function (Model, id, callback) {
  this._invoke(Model, 'findOne', arguments)
}
