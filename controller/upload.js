const config = require('../config')

class Upload {
  // 单文件上传
  static async singleFile (ctx) {
    if (ctx.req.file) {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "上传成功",
        result: {
          type: "single",
          originalname: ctx.req.file.originalname,
          path: `${config.upload.path}${ctx.req.file.filename}`
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        success: false,
        message: "文件丢失",
        result: {
          type: "single",
          originalname: "",
          path: ""
        }
      }
    }
  }
  // 多文件上传
  static async multerFile (ctx) {
    let fileList = [];
    ctx.req.files.map(elem => {
      fileList.push({
      originalname: elem.originalname,
      path: `${config.upload.path}${elem.filename}`
    });
  });
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "上传成功",
      result: {
        type: "sinmultergle",
        fileList: fileList
      }
    }
  }
}

module.exports = Upload
