/**
 * @file 文件上传
 */
const config = require('../config')
const multer = require('koa-multer')
const upload = multer({
  storage: multer.diskStorage({
    // 设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    // Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    // destination: function(req, file, cb) {
    //   cb(null, "./uploads/");
    // },
    destination: config.upload.destination,
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

module.exports = upload