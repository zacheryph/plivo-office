var plivo = require('plivo-node')
  , url = require('url')
  , app = plivo.RestAPI({
      authId: process.env.PLIVO_AUTH_ID,
      authToken: process.env.PLIVO_AUTH_TOKEN
  })
  , rootUrl = process.env.HEROKU_ROOT

function getRecordings() {
  return new Promise(function(resolve, reject) {
    app.get_recordings(null, function(status, body) {
      if (status !== 200) {
        return reject(status)
      }

      resolve(body)
    })
  })
}

function deleteRecording(id) {
  return new Promise(function(resolve, reject) {
    app.delete_recording({recording_id: id}, function(status, body) {
      if (status == 200) {
        resolve()
      }
      else {
        reject(body)
      }
    })
  })
}

function responseUrl(recording, idx) {
  path = url.parse(rootUrl + "/api/vm/response")
  path.query = {id: recording.recording_id, idx: idx || 0}
  return path.format()
}

var VoiceMail = {
  middleware: function *voicemailMiddleware(next) {
    if (this.request.query.To != "1") {
      return yield next
    }

    this.plivo.addPreAnswer()

    body = yield getRecordings()
    if (body.meta.total_count == 0) {
      this.plivo.addSpeak("You have no messages at this time")
      this.plivo.addHangup()
      return
    }

    this.plivo.addSpeak("Listening to " + body.meta.total_count + " messages")
    this.plivo.addWait({length: 1})
    digits = this.plivo.addGetDigits({
      method: "GET",
      action: responseUrl(body.objects[0]),
      validDigits: "79",
      numDigits: "1"})

    digits.addPlay(body.objects[0].recording_url)
    digits.addSpeak("To delete this message press 7.  To save this message press 9")
  },

  response: function *voicemailResponse(next) {
    recid = this.request.query.id
    idx = parseInt(this.request.query.idx) || 0

    switch(this.request.query.Digits) {
      case "7":
        yield deleteRecording(recid)
        this.plivo.addSpeak("Message deleted.")
        break
      case "9":
        this.plivo.addSpeak("Message saved.")
        idx += 1
        break
    }

    recordings = yield getRecordings()
    if (recordings.meta.total_count <= idx) {
      this.plivo.addSpeak("You have no more messages. Thank you.")
      this.plivo.addHangup()
    }
    else {
      rec = recordings.objects[idx]
      this.plivo.addSpeak("Next message")
      this.plivo.addWait({length: 1})
      digits = this.plivo.addGetDigits({
        method: "GET",
        action: responseUrl(rec, idx),
        validDigits: "79",
        numDigits: "1"})

      digits.addPlay(rec.recording_url)
      digits.addSpeak("To delete this message press 7.  To save this message press 9")
    }
  }
}

module.exports = VoiceMail
