/**
 * @desc 网站信息控制
 * @author Daker(Daker.zhou@gmail.com)
 */

const SiteModel = require('../models/site')

class Site {
  static async get (ctx) {
    let site = await SiteModel.findOne({})

    if (!site) {
      ctx.throw(404, "网站信息为空")
    }

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "网站信息获取成功",
      result: site
    }
  }

  // 更新网站信息
  static async update (ctx) {
    const siteInfo  = ctx.request.body

    let site = await SiteModel.findOne({})
    let _id

    if (!!site) {
      _id = site._id
      // keep likes when update site
      siteInfo.meta = site.meta
    }

    // 如果有_id则去除_id
    delete siteInfo._id

    // 检测黑名单和ping地址列表不能存入空元素
    if (siteInfo.blacklist) {
      siteInfo.blacklist.ips = (siteInfo.blacklist.ips || []).filter(t => !!t)
      siteInfo.blacklist.mails = (siteInfo.blacklist.mails || []).filter(t => !!t)
      siteInfo.blacklist.keywords = (siteInfo.blacklist.keywords || []).filter(t => !!t)
    }

    let result = !!_id ? await SiteModel.findByIdAndUpdate(_id, siteInfo, { new: true }) : await new SiteModel(siteInfo).save()

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "网站信息更新成功",
      result: result
    }
  }
}

module.exports = Site