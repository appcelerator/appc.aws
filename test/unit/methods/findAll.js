'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/findAll').findAll

var arrow
var connector
var S3BucketModel

test('### Start Arrow ###', function (t) {
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

test('### Should invoke findAll ###', function (t) {
  const sandbox = sinon.sandbox.create()

  // Spies, mocks, stubs
  const cbSpy = sandbox.spy()
  const _invokeStub = sandbox.stub(connector, '_invoke')

  // Function call
  method.call(connector, S3BucketModel, cbSpy)

  // Asserts
  t.ok(_invokeStub.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
