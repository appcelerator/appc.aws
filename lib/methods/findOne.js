'use strict'

exports.findOne = function (Model, id, callback) {
  const log = this.logger ? this.logger.warn.bind(this.logger) : console.warn
  log('The findOne method of a model is deprecated and will be removed in an upcoming major release. Please use findById instead.')

  // Fallback to findByID
  this.findByID.apply(this, arguments)
}
