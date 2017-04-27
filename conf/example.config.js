module.exports = {
  connectors: {
    'appc.aws.s3': {
      // AWS credentials
      accessKeyId: '',
      secretAccessKey: '',
      
      // Create models based on your schema that can be used in your API.
      generateModelsFromSchema: true,

      // Whether or not to generate APIs based on the methods in generated models.
      modelAutogen: false
    }
  }
}
