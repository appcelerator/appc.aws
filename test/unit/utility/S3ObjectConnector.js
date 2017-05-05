'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const S3ObjectConnector = require('../../../lib/utility/S3ObjectConnector')

var arrow
var connector
var S3ObjectModel
var s3ObjectConnector
var S3
var Arrow

test('### Start Arrow ###', (t) => {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.aws-s3')
      S3 = {
        putObject: () => { },
        deleteObject: () => { },
        listObjects: () => { },
        headObject: () => { },
        getSignedUrl: () => { },
        getObjectAcl: () => { }
      }
      Arrow = {
        Collection: () => { }
      }
      S3ObjectModel = arrow.getModel('S3Object')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should create s3ObjectConnector ###', (t) => {
  // Function call
  s3ObjectConnector = new S3ObjectConnector(Arrow, S3, connector)

  // Asserts
  t.ok(s3ObjectConnector)
  t.ok(s3ObjectConnector.Arrow)
  t.ok(s3ObjectConnector.connector)
  t.ok(s3ObjectConnector.S3)
  t.equal(s3ObjectConnector.connector.name, 'appc.aws-s3')

  t.end()
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.findAll(S3ObjectModel, cbSpy)

  // Asserts
  t.ok(cbSpy.calledOnce)
  t.equal(cbSpy.args[0][0].message, 'findAll not supported, use query instead')

  sandbox.restore()
  t.end()
})

test('### Should return instance ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const putObjectStub = sandbox.stub(S3, 'putObject').yieldsAsync(null, {
    ETag: '686897696a7c876b7e'
  })
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.create(S3ObjectModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(putObjectStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const putObjectStub = sandbox.stub(S3, 'putObject').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.create(S3ObjectModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.ok(putObjectStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return empty result ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const putObjectStub = sandbox.stub(S3, 'putObject').yieldsAsync(null, null)
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.create(S3ObjectModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(putObjectStub.calledOnce)
    t.equal(cbSpy.args[0][0], undefined)
    t.equal(cbSpy.args[0][1], undefined)

    sandbox.restore()
    t.end()
  })
})

test('### Should return instance ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const getPropertySpy = sandbox.stub().returns('xxx')
  const deleteObjectStub = sandbox.stub(S3, 'deleteObject').yieldsAsync()
  const cbSpy = sandbox.spy()

  // Test data
  const instance = {
    get: getPropertySpy
  }

  // Function call
  s3ObjectConnector.delete(S3ObjectModel, instance, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, instance))
    t.ok(getPropertySpy.calledTwice)
    t.ok(deleteObjectStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const getPropertySpy = sandbox.stub().returns('xxx')
  const deleteObjectStub = sandbox.stub(S3, 'deleteObject').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Test data
  const instance = {
    get: getPropertySpy
  }

  // Function call
  s3ObjectConnector.delete(S3ObjectModel, instance, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.ok(getPropertySpy.calledTwice)
    t.ok(deleteObjectStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return string ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const getPropertySpy = sandbox.stub().returns('xxx')
  const getSignedUrlStub = sandbox.stub(S3, 'getSignedUrl').returns('xxx')
  const cbSpy = sandbox.spy()

  // Test data
  const instance = {
    get: getPropertySpy
  }

  // Function call
  const signedUrl = s3ObjectConnector.getSignedUrl(S3ObjectModel, instance, cbSpy)

  // Asserts
  t.equal(signedUrl, 'xxx')
  t.ok(getPropertySpy.calledTwice)
  t.ok(getSignedUrlStub.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Should return collection ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const collection = []

  // Stubs & spies
  const listObjectsStub = sandbox.stub(S3, 'listObjects').yieldsAsync(null, {
    Contents: [{ Key: 'TestBucket' }]
  })
  const headObjectStub = sandbox.stub(S3, 'headObject').yieldsAsync(null, {})
  const getObjectAclStub = sandbox.stub(S3, 'getObjectAcl').yieldsAsync(null, {
    Grants: [{
      Permission: 'READ',
      Grantee: {
        URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
      }
    }]
  })
  const collectionStub = sandbox.stub(Arrow, 'Collection').returns(collection)
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.query(S3ObjectModel, { where: { Bucket: 'TestBucket', acl: 'xxx' } }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(collectionStub.calledOnce)
    t.ok(listObjectsStub.calledOnce)
    t.ok(headObjectStub.calledOnce)
    t.ok(getObjectAclStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Test data
  const collection = []

  // Stubs & spies
  const listObjectsStub = sandbox.stub(S3, 'listObjects').yieldsAsync(error)
  const headObjectStub = sandbox.stub(S3, 'headObject').yieldsAsync(null, {})
  const getObjectAclStub = sandbox.stub(S3, 'getObjectAcl').yieldsAsync(null, {
    Grants: [{
      Permission: 'READ',
      Grantee: {
        URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
      }
    }]
  })
  const collectionStub = sandbox.stub(Arrow, 'Collection').returns(collection)
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.query(S3ObjectModel, { where: { Bucket: 'TestBucket', acl: 'xxx' } }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.equal(collectionStub.callCount, 0)
    t.equal(headObjectStub.callCount, 0)
    t.equal(getObjectAclStub.callCount, 0)
    t.ok(listObjectsStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return instance ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const collection = []

  // Stubs & spies
  const listObjectsStub = sandbox.stub(S3, 'listObjects').yieldsAsync(null, {
    Contents: [{ Key: 'TestBucket' }]
  })
  const headObjectStub = sandbox.stub(S3, 'headObject').yieldsAsync(null, {})
  const collectionStub = sandbox.stub(Arrow, 'Collection').returns(collection)
  const cbSpy = sandbox.spy()

  // Function call
  s3ObjectConnector.findOne(S3ObjectModel, '7FbVwBcjkm9CeLdhWMeAn1GmbCsHdeAeAksdNWu0Nh4', cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(collectionStub.calledOnce)
    t.ok(listObjectsStub.calledOnce)
    t.ok(headObjectStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(() => {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
