var koa = require('koa')
  , mount = require('koa-mount')
  , Router = require('koa-router')
  , compose = require('koa-compose')
  , response = require('./plivo/response')
  , hangup = require('./plivo/auto-hangup')
  , calls = require('./plivo/calls')
  , voicemail = require('./plivo/voicemail')

module.exports = PlivoAPI

function PlivoAPI() {
  var api = koa()
    , callRouter = new Router()
    , vmRouter = new Router()

  callRouter
    .get('/inbound', calls.inboundCall)
    .get('/outbound', compose([voicemail.middleware, calls.outboundCall]))

  vmRouter
    .get('/response', voicemail.response)

  api
    .use(response())
    .use(mount('/call', compose([hangup(), callRouter.middleware()])))
    .use(mount('/vm', vmRouter.middleware()))

  return api
}
