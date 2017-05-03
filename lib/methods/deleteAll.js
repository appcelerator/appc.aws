'use strict'

exports.deleteAll = function (Model, callback) {
  this._invoke(Model, 'deleteAll', arguments)
}
