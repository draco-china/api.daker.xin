// 路由
const router = require('koa-router')()
const middleware = require('../middleware')
const User = require('../controller/user')
const Site = require('../controller/site')
const Icon = require('../controller/icon')
const Tag = require('../controller/tag')
const Category = require('../controller/category')
const Article = require('../controller/article')
const Github = require('../controller/github')

// 文件上传
const multerUpload = require('./upload')
const Upload = require('../controller/upload')

router
    .get('/', ctx => {
        ctx.body = {
            "name":"api.daker.xin",
            "version":"1.0.0",
            "author":"Daker",
            "site":"https://daker.xin",
            "github":"https://github.com/daker-china",
            "powered":["Vue","Nuxt.js","MongoDB","Nodejs","Express","Koa2","Nginx"]
        }
    })

    // auth
    .post('/login', User.login)
    // .post('/register', User.SignUp)
    // 获取作者资料
    .get('/user', User.get)
    .put('/user', User.update)

    // 获取全局配置
    .get('/site', Site.get)
    // 修改全局配置
    .put('/site', middleware.verifyToken, Site.update)

    // icon
    .get('/icons', Icon.get)

    // 标签管理
    .get('/tag', Tag.get)
    .post('/tag', middleware.verifyToken, Tag.create)
    .put('/tag/:id', middleware.verifyToken, Tag.update)
    .delete('/tag/:id', middleware.verifyToken, Tag.delete)

    // 分类管理
    .get('/category', Category.get)
    .post('/category', middleware.verifyToken, Category.create)
    .put('/category/:id', middleware.verifyToken, Category.update)
    .delete('/category/:id', middleware.verifyToken, Category.delete)

    // 单文件上传
    .post("/upload/singleFile", middleware.verifyToken, multerUpload.single("file"), Upload.singleFile)
    // 多文件上传
    .post("/upload/multerFile", middleware.verifyToken, multerUpload.array("file"), Upload.multerFile)

    // 文章管理
    .get('/article', Article.list)
    .get('/article/:id', Article.get)
    .post('/article', middleware.verifyToken, Article.create)
    .patch('/article', middleware.verifyToken, Article.patch)
    .put('/article/:id', middleware.verifyToken, Article.update)
    .delete('/article/:id', middleware.verifyToken, Article.delete)

    // 获取github项目
    .get('/github', Github.list)
module.exports = router
