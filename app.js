const Koa = require('koa')
const path = require('path')
const app = new Koa()

const convert = require('koa-convert')
const koaLogger = require('koa-logger')()
// 配置控制台日志中间件
app.use(convert(koaLogger))

const bodyparser = require('koa-bodyparser')()
// 使用ctx.body解析
app.use(bodyparser)

// data server
const mongodb = require('./db/mongodb')
mongodb.connect()

// middleware
const middleware = require('./middleware')

app.use(middleware.errorHandler)

// cors
const cors = require('koa2-cors')()
app.use(cors)

const routers = require('./routers')
app.use(routers.routes(), routers.allowedMethods())

app.listen(8888)
console.log('the server is starting at port 8888')