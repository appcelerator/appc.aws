'use strict'

const fetchmetadata = require('../../../lib/metadata/fetchMetadata').fetchMetadata
const sinon = require('sinon')
const test = require('tap').test

test('### Should fetch metadata ### ', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  var next = sandbox.spy()

  // Function call
  fetchmetadata(next)

  // Asserts
  t.ok(next.calledOnce)
  t.equals(next.firstCall.args[0], null)
  t.type(next.firstCall.args[1], 'object')

  // Restore
  sandbox.restore()

  // End
  t.end()
})
