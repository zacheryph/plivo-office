var plivo = require('plivo-node')

module.exports = function() {
  return function *plivoAutoHangup(next) {
    if (this.request.query.CallStatus == 'ringing') {
      yield next
    }
    else {
      this.plivo.addHangup()
    }
  }
}
