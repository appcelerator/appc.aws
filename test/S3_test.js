/* global before, after, describe, it */

const should = require('should')
const Arrow = require('arrow')
const async = require('async')

describe('S3', function () {
  var server,
    BucketModel,
    ObjectModel

  before(function (done) {
    server = new Arrow({ logLevel: 'warn' })
    server.start(function (err) {
      if (err) { return done(err) }
      BucketModel = server.getModel('appc.aws/S3Bucket')
      ObjectModel = server.getModel('appc.aws/S3Object')
      done()
    })
  })

  after(function (done) {
    server.stop(done)
  })

  it('should connect to AWS', function (done) {
    // make sure AWS connectivity is setup
    var AWS = require('aws-sdk')
    var config = require('../conf/local.js').connectors['appc.aws'].config
    AWS.config.update(config)
    var s3 = new AWS.S3()
    s3.listBuckets(function (err) {
      should(err).not.be.ok
      done()
    })
  })

  describe('Buckets', function () {
    it('should findAll and findOne', function (done) {
      BucketModel.findAll(function (err, result) {
        should(err).not.be.ok
        should(result).be.ok
        try {
          async.map(result, function (bucket, cb) {
            should(bucket).be.ok
            BucketModel.findOne(bucket.getPrimaryKey(), function (err, bucket2) {
              should(err).not.be.ok
              should(bucket2).be.ok
              should(bucket.getPrimaryKey()).be.equal(bucket2.getPrimaryKey())
              cb(null, bucket2)
            })
          }, done)
        } catch (E) {
          done(E)
        }
      })
    })

    it('should create and delete', function (done) {
      var name = 'test_bucket_' + Date.now()
      BucketModel.create({ name: name }, function (err, bucket) {
        should(err).not.be.ok
        should(bucket).be.ok
        BucketModel.delete(bucket, done)
      })
    })
  })

  describe('Objects', function () {
    it('should create and then delete', function (done) {
      var params = {
        bucket: 'appc-test',
        name: 'foo.txt',
        body: new Buffer('bar'),
        acl: 'public-read'
      }
      ObjectModel.create(params, function (err, result) {
        should(err).not.be.ok
        should(result).be.ok
        result.delete(done)
      })
    })

    it('should query', function (done) {
      var params = {
        bucket: 'appc-test',
        name: 'query.txt',
        body: new Buffer('bar'),
        acl: 'private'
      }
      ObjectModel.create(params, function (err, result) {
        should(err).not.be.ok
        should(result).be.ok
        ObjectModel.query({ where: { bucket: 'appc-test', acl: 'private' } }, function (err, result) {
          should(err).not.be.ok
          should(result).be.ok
          should(result[0].getSignedUrl({ Expires: 60 })).be.a.string
          Arrow.Request(result[0].getSignedUrl({ Expires: 60 }), function (err, resp, body) {
            should(err).not.be.ok
            should(resp).be.an.object
            should(body).be.a.string
            should(body).be.equal('bar')
            result[0].delete(done)
          })
        })
      })
    })
  })
})
