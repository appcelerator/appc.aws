'use strict'

const _ = require('lodash')
const Arrow = require('arrow')

exports._invoke = function (Model, method, args) {
  try {
    var connector = this.getAWSConnector(Arrow, this, Model)
    return connector[method].apply(connector, args)
  } catch (E) {
    var callback = args[args.length - 1]
    if (callback && _.isFunction(callback)) {
      return callback(E)
    } else {
      throw E
    }
  }
}
