'use strict'

/**
 * Disconnects from your data store.
 * @param next
 */
exports.disconnect = function (next) {
  this.logger.debug('disconnecting')
  this.logger.debug('disconnected')
  next()
}
