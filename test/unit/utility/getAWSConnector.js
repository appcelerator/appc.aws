'use strict'

const test = require('tap').test

const server = require('../../server')
const method = require('../../../lib/utility/getAWSConnector').getAWSConnector

var arrow
var connector
var S3BucketModel

test('### Start Arrow ###', (t) => {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.aws-s3')
      S3BucketModel = arrow.getModel('S3Bucket')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should return S3BucketConnector ###', (t) => {
  // Function call
  const conn = method.call(connector, arrow, connector, S3BucketModel)

  // Asserts
  t.ok(conn)
  t.ok(conn.Arrow)
  t.ok(conn.connector)
  t.ok(conn.S3)
  t.equal(conn.connector.name, 'appc.aws-s3')

  t.end()
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(() => {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
