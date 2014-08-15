var plivo = require('plivo-node')

module.exports = function() {
  return function *plivoEndpoint(next) {
    this.plivo = plivo.Response()
    yield next
    this.body = this.plivo.toXML()
  }
}
