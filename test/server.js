'use strict'

const Arrow = require('arrow')

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    const arrow = new Arrow({}, true)
    const connector = arrow.getConnector('appc.aws-s3')
    connector.metadata = {}

    // Return the arrow instance
    resolve(arrow)
  })
}
