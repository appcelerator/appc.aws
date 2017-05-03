'use strict'

exports['delete'] = function (Model, instance, callback) {
  this._invoke(Model, 'delete', arguments)
}
