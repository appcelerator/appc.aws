'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/utility/_invoke')._invoke

var arrow
var connector
var S3BucketModel

test('### Start Arrow ###', (t) => {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.aws.s3')
      S3BucketModel = arrow.getModel('S3Bucket')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should call method ###', (t) => {
  const sandbox = sinon.sandbox.create()

  // Test data
  const testArgs = []

  // Stubs, spies
  const saveSpy = sandbox.spy()
  const getAWSConnectorStub = sandbox.stub(connector, 'getAWSConnector').returns({
    save: saveSpy
  })

  // Function call
  method.call(connector, S3BucketModel, 'save', testArgs)

  // Asserts
  t.ok(getAWSConnectorStub.calledOnce)
  t.ok(saveSpy.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Should handle errors ###', (t) => {
  const sandbox = sinon.sandbox.create()

  // Stubs, spies
  const cbSpy = sandbox.spy()
  const getAWSConnectorStub = sandbox.stub(connector, 'getAWSConnector').throws('Fail')

  // Function call
  method.call(connector, S3BucketModel, 'save', [cbSpy])

  // Asserts
  t.ok(getAWSConnectorStub.calledOnce)
  t.ok(cbSpy.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(() => {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
