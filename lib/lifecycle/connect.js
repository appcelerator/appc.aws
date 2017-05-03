'use strict'

const AWS = require('aws-sdk')

/**
 * Connects to your data store; this connection can later be used by your connector's methods.
 * @param next
 */
exports.connect = function (next) {
  this.logger.debug('connecting')
  AWS.config.update(this.config)
  this.logger.debug('connected')
  next()
}
