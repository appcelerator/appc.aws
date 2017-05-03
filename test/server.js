'use strict'

const Arrow = require('arrow')

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    const arrow = new Arrow({}, true)
    const connector = arrow.getConnector('appc.aws.s3')
    connector.metadata = {}

    // arrow.addModel(Arrow.createModel('S3Bucket', {
    //   fields: {
    //     name: {
    //       type: String, required: true, name: 'Bucket'
    //     },
    //     acl: {
    //       type: String, name: 'ACL'
    //     },
    //     createBucketConfiguration: {
    //       type: Object, name: 'CreateBucketConfiguration'
    //     },
    //     grantFullControl: {
    //       type: String, name: 'GrantFullControl'
    //     },
    //     grantRead: {
    //       type: String, name: 'GrantRead'
    //     },
    //     grantReadACP: {
    //       type: String, name: 'GrantReadACP'
    //     },
    //     grantWrite: {
    //       type: String, name: 'GrantWrite'
    //     },
    //     grantWriteACP: {
    //       type: String, name: 'GrantWriteACP'
    //     },
    //     location: {
    //       type: String, readonly: true, name: 'Location'
    //     },
    //     creationDate: {
    //       type: Date, readonly: true, name: 'CreationDate'
    //     }
    //   },
    //   connector: 'appc.aws.s3'
    // }))

    // arrow.addModel(Arrow.createModel('S3Object', {
    //   fields: {
    //     name: {
    //       type: String, required: true, name: 'Key'
    //     },
    //     bucket: {
    //       type: String, required: true, name: 'Bucket'
    //     },
    //     acl: {
    //       type: String, name: 'ACL'
    //     },
    //     body: {
    //       type: Object, required: true, name: 'Body'
    //     },
    //     cacheControl: {
    //       type: String, name: 'CacheControl'
    //     },
    //     contentDisposition: {
    //       type: String, name: 'ContentDisposition'
    //     },
    //     contentEncoding: {
    //       type: String, name: 'ContentEncoding'
    //     },
    //     contentLanguage: {
    //       type: String, name: 'ContentLanguage'
    //     },
    //     contentLength: {
    //       type: Number, name: 'ContentLength'
    //     },
    //     contentMD5: {
    //       type: String, name: 'ContentMD5'
    //     },
    //     contentType: {
    //       type: String, name: 'ContentType'
    //     },
    //     expires: {
    //       type: Date, name: 'Expires'
    //     },
    //     grantFullControl: {
    //       type: String, name: 'GrantFullControl'
    //     },
    //     grantRead: {
    //       type: String, name: 'GrantRead'
    //     },
    //     grantReadACP: {
    //       type: String, name: 'GrantReadACP'
    //     },
    //     grantWriteACP: {
    //       type: String, name: 'GrantWriteACP'
    //     },
    //     metadata: {
    //       type: Object, name: 'Metadata'
    //     },
    //     requestPayer: {
    //       type: String, name: 'RequestPayer'
    //     },
    //     SSECustomerAlgorithm: {
    //       type: String
    //     },
    //     SSECustomerKey: {
    //       type: String
    //     },
    //     SSECustomerKeyMD5: {
    //       type: String
    //     },
    //     SSEKMSKeyId: {
    //       type: String
    //     },
    //     serverSideEncryption: {
    //       type: String, name: 'ServerSideEncryption'
    //     },
    //     storageClass: {
    //       type: String, name: 'StorageClass'
    //     },
    //     websiteRedirectLocation: {
    //       type: String, name: 'WebsiteRedirectLocation'
    //     },
    //     etag: {
    //       type: String, name: 'ETag', readonly: true
    //     },
    //     size: {
    //       type: Number, name: 'Size', readonly: true
    //     },
    //     lastModified: {
    //       type: Date, name: 'LastModified', readonly: true
    //     }
    //   },
    //   connector: 'appc.aws.s3',

    //   getSignedUrl: function (params) {
    //     var connector = Arrow.getConnector('appc.aws.s3')
    //     return connector.getSignedUrl(connector.getModel('S3Object'), this, params)
    //   }
    // }))

    // Return the arrow instance
    resolve(arrow)
  })
}
