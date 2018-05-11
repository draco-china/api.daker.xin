/**
 * @desc Github控制
 * @author Daker(Daker.zhou@gmail.com)
 */

const rp = require('request-promise')

class Github {
  static async list (ctx) {
    try {
      let result = await rp({ url: `https://api.github.com/users/Daker-china/repos`, headers: { 'User-Agent': 'request' }})
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "获取github项目列表",
        result: JSON.parse(result)
      }
    } catch (error) {
      list(ctx)
      console.warn('项目列表获取失败 - ', 'err: ', err)
    }
  }
}

module.exports = Github