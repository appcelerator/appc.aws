'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const S3BucketConnector = require('../../../lib/utility/S3BucketConnector')

var arrow
var connector
var S3BucketModel
var s3BucketConnector
var S3
var Arrow

test('### Start Arrow ###', (t) => {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.aws-s3')
      S3 = {
        listBuckets: () => { },
        headBucket: () => { },
        deleteBucket: () => { },
        createBucket: () => { }
      }
      Arrow = {
        Collection: () => { }
      }
      S3BucketModel = arrow.getModel('S3Bucket')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should create S3BucketConnector ###', (t) => {
  // Function call
  s3BucketConnector = new S3BucketConnector(Arrow, S3, connector)

  // Asserts
  t.ok(s3BucketConnector)
  t.ok(s3BucketConnector.Arrow)
  t.ok(s3BucketConnector.connector)
  t.ok(s3BucketConnector.S3)
  t.equal(s3BucketConnector.connector.name, 'appc.aws-s3')

  t.end()
})

test('### Should return collection ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const collection = []

  // Stubs & spies
  const listBucketsStub = sandbox.stub(S3, 'listBuckets').yieldsAsync(null, {
    Buckets: [{ Name: 'TestBucket' }]
  })
  const collectionStub = sandbox.stub(Arrow, 'Collection').returns(collection)
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.findAll(S3BucketModel, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, collection))
    t.ok(listBucketsStub.calledOnce)
    t.ok(collectionStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const listBucketsStub = sandbox.stub(S3, 'listBuckets').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.findAll(S3BucketModel, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.ok(listBucketsStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return instance ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const getPrimaryKeySpy = sandbox.stub().returns('TestBucket')
  const deleteBucketStub = sandbox.stub(S3, 'deleteBucket').yieldsAsync()
  const cbSpy = sandbox.spy()

  // Test data
  const instance = {
    getPrimaryKey: getPrimaryKeySpy
  }

  // Function call
  s3BucketConnector.delete(S3BucketModel, instance, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, instance))
    t.ok(getPrimaryKeySpy.calledOnce)
    t.ok(deleteBucketStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const getPrimaryKeySpy = sandbox.stub().returns('TestBucket')
  const deleteBucketStub = sandbox.stub(S3, 'deleteBucket').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Test data
  const instance = {
    getPrimaryKey: getPrimaryKeySpy
  }

  // Function call
  s3BucketConnector.delete(S3BucketModel, instance, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.ok(getPrimaryKeySpy.calledOnce)
    t.ok(deleteBucketStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return instance ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const headBucketStub = sandbox.stub(S3, 'headBucket').yieldsAsync(null, {
    Name: 'TestBucket'
  })
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.findOne(S3BucketModel, 'TestBucket', cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(headBucketStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const headBucketStub = sandbox.stub(S3, 'headBucket').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.findOne(S3BucketModel, 'TestBucket', cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.ok(headBucketStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.save(S3BucketModel, {}, cbSpy)

  // Asserts
  t.ok(cbSpy.calledOnce)
  t.equal(cbSpy.args[0][0].message, 'save is not supported')

  sandbox.restore()
  t.end()
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.deleteAll(S3BucketModel, cbSpy)

  // Asserts
  t.ok(cbSpy.calledOnce)
  t.equal(cbSpy.args[0][0].message, 'deleteAll is not supported')

  sandbox.restore()
  t.end()
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.query(S3BucketModel, {}, cbSpy)

  // Asserts
  t.ok(cbSpy.calledOnce)
  t.equal(cbSpy.args[0][0].message, 'query is not supported')

  sandbox.restore()
  t.end()
})

test('### Should return instance ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const createBucketStub = sandbox.stub(S3, 'createBucket').yieldsAsync(null, {
    Location: 'TestBucket'
  })
  const headBucketStub = sandbox.stub(S3, 'headBucket').yieldsAsync(null, {
    Name: 'TestBucket'
  })
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.create(S3BucketModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(headBucketStub.calledOnce)
    t.ok(createBucketStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const createBucketStub = sandbox.stub(S3, 'createBucket').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.create(S3BucketModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(error))
    t.ok(createBucketStub.calledOnce)

    sandbox.restore()
    t.end()
  })
})

test('### Should return error ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Test data
  const error = new Error('Fail')

  // Stubs & spies
  const createBucketStub = sandbox.stub(S3, 'createBucket').yieldsAsync(null, {
    Location: 'TestBucket'
  })
  const headBucketStub = sandbox.stub(S3, 'headBucket').yieldsAsync(error)
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.create(S3BucketModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.ok(headBucketStub.calledOnce)
    t.ok(createBucketStub.calledOnce)
    t.ok(cbSpy.calledWith(error))

    sandbox.restore()
    t.end()
  })
})

test('### Should return empty result ###', (t) => {
  var sandbox = sinon.sandbox.create()

  // Stubs & spies
  const createBucketStub = sandbox.stub(S3, 'createBucket').yieldsAsync(null, null)
  const headBucketStub = sandbox.stub(S3, 'headBucket').yieldsAsync(null, {
    Name: 'TestBucket'
  })
  const cbSpy = sandbox.spy()

  // Function call
  s3BucketConnector.create(S3BucketModel, { Bucket: 'TestBucket' }, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)
    t.equal(cbSpy.args[0][0], undefined)
    t.equal(cbSpy.args[0][1], undefined)
    t.equal(headBucketStub.callCount, 0)
    t.ok(createBucketStub.calledOnce)

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
