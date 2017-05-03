'use strict'

exports.save = function (Model, instance, callback) {
  this._invoke(Model, 'save', arguments)
}
