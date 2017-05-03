'use strict'

const path = require('path')
const AWS = require('aws-sdk')
var S3
const cache = {}

exports.getAWSConnector = function (Arrow, connector, Model) {
  const name = Model.name
  var found = cache[name]

  if (found) {
    return found.connector
  }

  if (name.indexOf('S3') === 0) {
    AWS.config = connector.config
    S3 = S3 || new AWS.S3()

    const object = name.substring(2)
    const Connector = require(path.join(__dirname, 'S3' + object + 'Connector.js'))

    cache[name] = found = {
      name: 'S3',
      object: object,
      instance: S3,
      connector: new Connector(Arrow, S3, connector)
    }
  }
  return found && found.connector
}
