'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../server')

var arrow
var connector

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst
      connector = arrow.getConnector('appc.aws-s3')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Test Model S3Object ###', function (t) {
  var sandbox = sinon.sandbox.create()

  const Model = arrow.getModel('S3Object')

  // Stubs & spies
  const getSignedUrlStub = sandbox.stub(connector, 'getSignedUrl').yieldsAsync()
  const cbSpy = sandbox.spy()

  Model.getSignedUrl(cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(getSignedUrlStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
