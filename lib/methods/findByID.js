'use strict'

exports.findByID = function (Model, id, callback) {
  this._invoke(Model, 'findOne', arguments)
}
