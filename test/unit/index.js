'use strict'

const test = require('tap').test
const sinon = require('sinon')
const semver = require('semver')

const server = require('../server')
const index = require('../../lib/index').create

var arrow
var connector

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst
      connector = arrow.getConnector('appc.mssql')
      arrow.Connector = connector
      arrow.Connector.Capabilities = {}

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Test Index.js Error Case ###', function (t) {
  const sandbox = sinon.sandbox.create()

  const semverLtStub = sandbox.stub(semver, 'lt', function (actualVersion, desiredVersion) {
    return true
  })

  // Asserts
  t.throws(index.bind(connector, arrow), 'This connector requires at least version 1.2.53 of Arrow please run `appc use latest`.')
  t.ok(semverLtStub.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Test Index.js Valid case ###', function (t) {
  const sandbox = sinon.sandbox.create()

  // Spies, mocks, stubs
  const semverLtStub = sandbox.stub(semver, 'lt', function (actualVersion, desiredVersion) { return false })
  const extendSpy = sandbox.spy()

  arrow.Connector.extend = extendSpy

  // Function call
  index.call(connector, arrow)

  // Asserts
  t.ok(semverLtStub.calledOnce)
  t.ok(extendSpy.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
