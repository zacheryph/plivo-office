var koa = require('koa')
  , mount = require('koa-mount')
  , logger = require('koa-logger')
  , response = require('koa-response-time')
  , plivoApi = require('./lib/api')
  , app = module.exports = koa()
  , port = process.env.PORT || 3000

require('koa-qs')(app)

app
  .use(response())
  .use(logger())
  .use(mount('/api', plivoApi()))

app.listen(port)
console.log("Plivo Office: listening on port " + port)
