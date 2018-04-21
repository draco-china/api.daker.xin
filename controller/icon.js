const fs = require('fs');  //fs是读取文件的模板工具
const path = require('path')

// const icon = require('../json/icon.json')
class Icon {

  // static async get (ctx) {
  //     let icons = []
  //     icon.data.icons.forEach(item => {
  //         icons.push(item.name)
  //     })
  //     ctx.status = 200
  //     ctx.body = {
  //         success: true,
  //         message: 'icon获取成功',
  //         data: icons
  //     }
  // }

  static async get(ctx) {
    let icon = fs.readFileSync(path.resolve(__dirname, '../json/icon.json'), 'utf8')
    icon = JSON.parse(icon) // 获取json文件对象
    let icons = []
    icon.data.icons.forEach(item => {
      icons.push(`icon-${item.name}`)
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      message: 'icon获取成功',
      result: {
        list: icons
      }
    }
  }
}

module.exports = Icon