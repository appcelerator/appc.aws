'use strict'

const test = require('tap').test
const sinon = require('sinon')

const AWS = require('aws-sdk')
const connectMethod = require('../../../lib/lifecycle/connect')['connect']

test('### Should connect ###', function (t) {
  const sandbox = sinon.sandbox.create()

  // Data
  const context = {
    config: {},
    logger: {
      debug: sandbox.spy()
    }
  }

  // Stubs, spies
  const awsConfigUpdate = sandbox.stub(AWS.config, 'update')
  const nextSpy = sandbox.spy()

  // Function call
  connectMethod.call(context, nextSpy)

  // Asserts
  t.ok(awsConfigUpdate.calledOnce)
  t.ok(awsConfigUpdate.calledWith(context.config))
  t.ok(nextSpy.calledOnce)

  sandbox.restore()
  t.end()
})
