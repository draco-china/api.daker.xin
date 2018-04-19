/**
 * @file 文件上传
 */
const multer = require('koa-multer')
const upload = multer({
  storage: multer.diskStorage({
    // 设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    // Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    // destination: function(req, file, cb) {
    //   cb(null, "./uploads/");
    // },
    destination: "../admin.daker.xin/static/img/",
    // TODO: 文件区分目录存放
    // 获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function(req, file, cb) {
      // let changedName = new Date().getTime() + "-" + file.originalname;
      // cb(null, changedName);
      const originalname = file.originalname
      let pointIndex = originalname.lastIndexOf('.')
      let filename = originalname.substr(0,pointIndex)
      let suffix = originalname.substr(pointIndex+1)
      cb(null, filename+'-' +Date.now()+'.'+suffix)
    }
  })
});

const router = require('koa-router')()
const middleware = require('../middleware')
const User = require('../controller/user')
const Icon = require('../controller/icon')
const Tag = require('../controller/tag')
const Category = require('../controller/category')
const Upload = require('../controller/upload')
const Article = require('../controller/article')

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
    .post('/login', User.SignIn)
    .post('/register', User.SignUp)

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
    .post("/upload/singleFile", middleware.verifyToken, upload.single("file"), Upload.singleFile)
    // 多文件上传
    .post("/upload/multerFile", middleware.verifyToken, upload.array("file"), Upload.multerFile)

    // 文章管理
    .get('/article', Article.list)
    .get('/article/:id', Article.get)
    .post('/article', middleware.verifyToken, Article.create)
    .patch('/article', middleware.verifyToken, Article.patch)
    .put('/article/:id', middleware.verifyToken, Article.update)
    .delete('/article/:id', middleware.verifyToken, Article.delete)
module.exports = router
