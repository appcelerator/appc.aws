'use strict'

function S3BucketConnector (Arrow, S3, connector) {
  this.Arrow = Arrow
  this.S3 = S3
  this.connector = connector
}

S3BucketConnector.prototype.findAll = function (Model, callback) {
  this.S3.listBuckets(function (err, result) {
    if (err) { return callback && callback(err) }
    var instances = result && result.Buckets && result.Buckets.map(function (bucket) {
      var instance = Model.instance(bucket, true)
      instance.set('name', bucket.Name)
      instance.setPrimaryKey(bucket.Name)
      return instance
    })
    callback && callback(null, instances && new this.Arrow.Collection(instances))
  }.bind(this))
}

S3BucketConnector.prototype.findOne = function (Model, id, callback) {
  this.S3.headBucket({ Bucket: id }, function (err, result) {
    if (err) { return callback && callback(err) }
    var instance = Model.instance(result, true)
    instance.set('name', id)
    instance.setPrimaryKey(id)
    return callback && callback(null, instance)
  })
}

S3BucketConnector.prototype.create = function (Model, values, callback) {
  var params = {}
  Object.keys(Model.fields)
    .filter(function (k) {
      return !Model.fields[k].readonly
    })
    .forEach(function (k) {
      var field = Model.fields[k]

      if (typeof values[field.name || k] !== 'undefined') {
        params[field.name || k] = values[field.name || k]
      }
    })

  var self = this
  this.S3.createBucket(params, function (err, result) {
    if (err) { return callback && callback(err) }
    if (result && result.Location) {
      self.findOne(Model, params.Bucket, function (err, bucket) {
        if (err) { return callback(err) }
        var instance = Model.instance(bucket, true)
        instance.set('name', bucket.name)
        instance.setPrimaryKey(bucket.id)
        return callback && callback(null, instance)
      })
    } else {
      return callback && callback()
    }
  })
}

S3BucketConnector.prototype.delete = function (Model, instance, callback) {
  this.S3.deleteBucket({ Bucket: instance.getPrimaryKey() }, function (err, result) {
    if (err) { return callback && callback(err) }
    callback && callback(null, instance)
  })
}

S3BucketConnector.prototype.save = function (Model, instance, callback) {
  return callback && callback(new Error('save is not supported'))
}

S3BucketConnector.prototype.deleteAll = function (Model, callback) {
  return callback && callback(new Error('deleteAll is not supported'))
}

S3BucketConnector.prototype.query = function (Model, options, callback) {
  return callback && callback(new Error('query is not supported'))
}

module.exports = S3BucketConnector
