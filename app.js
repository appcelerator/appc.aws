/**
 * NOTE: This file is simply for testing this connector and will not
 * be used or packaged with the actual connector when published.
 */
const Arrow = require('arrow')
const server = new Arrow()

// lifecycle examples
server.on('starting', function () {
  server.logger.debug('server is starting!')
})

server.on('started', function () {
  server.logger.debug('server started!')
})

// a simple user model
const User = Arrow.Model.extend('user', {
  fields: {
    name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
  },
  connector: 'appc.aws.s3' // a model level connector
})

// create some users programmatically
var users = [
  { name: 'Jeff' },
  { name: 'Nolan' },
  { name: 'Neeraj' },
  { name: 'Tony' },
  { name: 'Rick' },
  { name: 'Kranthi' }
]
User.create(users, function (err, users) {
  if (err) {
    return server.logger.info('Error while creating some users', err)
  }

  server.logger.info('Created some users', users)
})

// add the model since we're creating outside of models directory
server.addModel(User)

// start the server
server.start()
