var Arrow = require('arrow')

/**
 * Fetches metadata describing your connector's proper configuration.
 * @param next
 */
exports.fetchMetadata = function (next) {
  next(null, {
    fields: [
      Arrow.Metadata.URL({
        name: 'accessKeyId',
        description: 'the accessKeyId for your account',
        required: true
      }),
      Arrow.Metadata.Text({
        name: 'secretAccessKey',
        description: 'the secretAccessKey for your account',
        required: true
      }),
      Arrow.Metadata.Text({
        name: 'region',
        description: 'region',
        required: false
      }),
      Arrow.Metadata.Checkbox({
        name: 'sslEnabled',
        default: true,
        description: 'use SSL or not'
      }),
      Arrow.Metadata.Integer({
        name: 'maxRetries',
        default: 10,
        description: 'the maximum of retries when using the AWS API'
      })
    ]
  })
}
