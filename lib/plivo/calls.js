var sift = require('sift')
  , numbers = require('../../numbers')

var CallRouter = {
  inboundCall: function *(next) {
    var dest = sift({number: this.request.query.To}, numbers)[0]
      , dial = this.plivo.addDial({timeout: 30})

    dial.addUser(dest.sip_uri)
    this.plivo.addSpeak('Please leave a message after the tone.')
    this.plivo.addRecord()
  },
  outboundCall: function *(next) {
    var src = sift({sip_uri: this.request.query.From}, numbers)[0] || numbers[0]
      , dest = this.request.query.To
      , dial = this.plivo.addDial({callerId: src.number, callerName: src.callerName})

    if (dest.length == 7) { dest = "563" + dest }
    if (dest.length == 10) { dest = "1" + dest }

    dial.addNumber(dest)
  }
}

module.exports = CallRouter
