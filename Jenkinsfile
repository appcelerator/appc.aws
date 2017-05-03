#!groovy
@Library('pipeline-library') _

timestamps {
	node('git && (osx || linux)') {
		stage('Checkout') {
			checkout scm
		}

		stage('Configuration') {
			sh "echo \"module.exports = { logLevel: 'error', connectors: { 'appc.aws.s3': { accessKeyId: '<ACCESS_KEY_ID>, secretAccessKey: 'SECRET_ACCESS_KEY'' }}}\" > conf/local.js"
		}

		buildConnector {
			// don't override anything yet
		}
	}
}
