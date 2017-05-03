'use strict'

const test = require('tap').test
const sinon = require('sinon')

const disconnectMethod = require('../../../lib/lifecycle/disconnect')['disconnect']

test('### Should disconnect ###', function (t) {
  const sandbox = sinon.sandbox.create()

  // Data
  const context = {
    logger: {
      debug: sandbox.spy()
    }
  }

  // Stubs, spies
  const nextSpy = sandbox.spy()

  // Function call
  disconnectMethod.call(context, nextSpy)

  // Asserts
  t.ok(nextSpy.calledOnce)

  sandbox.restore()
  t.end()
})
