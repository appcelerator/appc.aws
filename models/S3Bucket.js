var Arrow = require('arrow');

var S3Bucket = Arrow.Model.extend('S3Bucket', {
	fields: {
		name: { type: String, description: 'the bucket name', required: true, name: 'Bucket' },
		acl: { type: String, description: 'the bucket acl: private, public-read, public-read-write, authenticated-read', name: 'ACL'},
		createBucketConfiguration: { type: Object, description: 'bucket configuration', name: 'CreateBucketConfiguration'},
		grantFullControl: {type: String, description: 'Allows grantee the read, write, read ACP, and write ACP permissions on the bucket.', name: 'GrantFullControl'},
		grantRead: {type: String, description: 'Allows grantee to list the objects in the bucket.', name: 'GrantRead'},
		grantReadACP: {type: String, description: 'Allows grantee to read the bucket ACL.', name: 'GrantReadACP'},
		grantWrite: {type: String, description: 'Allows grantee to create, overwrite, and delete any object in the bucket.', name: 'GrantWrite'},
		grantWriteACP: {type: String, description: 'Allows grantee to write the ACL for the applicable bucket.', name: 'GrantWriteACP'},
		location: {type: String, description: 'the location of the bucket', readonly: true, name: 'Location'},
		creationDate: {type: Date, description: 'the creation date of the bucket', readonly: true, name: 'CreationDate'}
	},
	connector: 'appc.aws.s3'
});

module.exports = S3Bucket;