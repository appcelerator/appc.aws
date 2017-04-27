'use strict'

exports.getSignedUrl = function (Model, instance, params) {
  return this._invoke(Model, 'getSignedUrl', arguments)
}
