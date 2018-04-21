/**
 * @file 标签控制
 */

const TagModel = require('../models/tag')
const ArticleModel = require('../models/article')

const select = {
  '__v': false
}

class Tag {
  // 创建标签
  static async create(ctx) {
    const tag = ctx.request.body

    // name validate
    if (!tag.name) {
      return ctx.throw(400, '标签名为空')
    }

    if (await TagModel.findOne({name: tag.name}).exec()) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "标签已存在"
      }
      return
    }

    if (await CategoryModel.findOne({slug: tag.slug}).exec()) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "该链接已经被使用"
      }
      return
    }

    await new TagModel(tag).save().then(() => {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "标签创建成功"
      }

    }).catch(() => {
      ctx.throw(400, '标签创建失败')
    })
  }

  // 获取标签
  static async get(ctx) {
    let {currentPage, pageSize, keyword = ''} = ctx.query
    // 查询参数
    const keywordReg = new RegExp(keyword)

    const query = {
      "$or": [
        {'name': keywordReg},
        {'description': keywordReg}
      ]
    }

    if (currentPage && pageSize) {
      // 过滤条件
      const options = {
        sort: {_id: 1},
        page: Number(currentPage || 1),
        limit: Number(pageSize || 10),
        populate: ["article"],
        select: select
      }
      const tags = await TagModel.paginate(query, options)

      let counts = await
      ArticleModel.aggregate([
        {$unwind: "$tag"},
        {
          $group: {
            _id: "$tag",
            num_tutorial: {$sum: 1}
          }
        }
      ])

      let newDocs = tags.docs.map(tag => {
        const match = counts.find(count => {
          return String(count._id) === String(tag._id)
        })
        tag._doc.articleTotal = match ? match.num_tutorial : 0
        return tag
      })

      ctx.status = 200
      ctx.body = {
        success: true,
        message: "获取所有标签",
        result: {
          list: newDocs,
          pagination: {
            currentPage: tags.page,
            pageSize: tags.limit,
            total: tags.total,
            totalPage: tags.pages
          }
        }
      }
    } else {
      const tags = await TagModel.aggregate([
        {
          $lookup: {
            from: "articles",
            localField: "_id",
            foreignField: "tag",
            as: "articleTotal"
          }
        },
        {$match: query},
        {$project: select}
      ])
      tags.forEach(item => {
        item.articleTotal = item.articleTotal.length
      })
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "获取所有标签",
        result: {
          list: tags
        }
      }
    }
  }

  // 更新标签
  static async update(ctx) {
    const tag = ctx.request.body
    const id = ctx.params.id

    // name validate
    if (!tag.name) {
      return ctx.throw(400, '标签名为空')
    }

    // if new category's name duplicated
    const isExist = await
    TagModel.findOne({name: tag.name})

    if (isExist && String(isExist._id) !== id) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "标签已存在",
        result: isExist
      }
    } else {

      let tagItem = await TagModel.findByIdAndUpdate(id, tag, {new: true, select})

      if (!tagItem) {
        ctx.throw(404, '标签ID不存在')
      } else {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "标签更新成功",
          result: tagItem
        }
      }
    }
  }

  // 删除标签
  static async delete(ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await TagModel.findOne({_id: id})

    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "标签ID不存在"
      }
      return
    }

    await TagModel.remove({_id: id})

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "标签删除成功"
    }
  }

}

module.exports = Tag