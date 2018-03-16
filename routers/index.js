const router = require('koa-router')()

const User = require('../controller/user')

router
    .get('/', (ctx) => {
        ctx.body = {
            "name":"api.daker.xin",
            "version":"1.0.0",
            "author":"Daker",
            "site":"https://daker.xin",
            "github":"https://github.com/daker-china",
            "powered":["Vue","Nuxt.js","MongoDB","Nodejs","Express","Koa2","Nginx"]
        }
    })
    .post('/login', User.SignIn)
    .post('/register', User.SignUp)

module.exports = router
