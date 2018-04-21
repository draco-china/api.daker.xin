/**
 * @file 控制
 */

const ArticleModel = require('../models/article')
const TagModel = require('../models/tag')
const CategoryModel = require('../models/category')

const select = {
  '__v': false
}

class Article {
  // 获取文章列表
  static async list(ctx) {
    let {currentPage, pageSize, state, keyword, categorySlug, tagSlug, date, hot} = ctx.query

    // filter options
    const options = {
      sort: {createAt: -1},
      page: Number(currentPage || 1),
      limit: Number(pageSize || 10),
      populate: ["category", "tag"],
      select: {
        'content': false,
        '__v': false
      }
    };

    // 查询参数
    let querys = {}

    // 按照state查询
    if (['0', '1', '-1'].includes(state)) {
      querys.state = state
    }

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword);
      querys['$or'] = [
        {'title': keywordReg},
        {'content': keywordReg},
        {'description': keywordReg}
      ]
    }

    // 标签id查询
    if (tagSlug) {
      let tag = await TagModel.findOne({slug: tagSlug})
      querys.tag = tag._id
    }

    // 分类id查询
    if (categorySlug) {
      let category = await CategoryModel.findOne({slug: categorySlug})
      querys.category = category._id
    }

    // 热评查询
    if (!!hot) {
      options.sort = {
        'meta.comments': -1,
        'meta.likes': -1
      }
    }

    // 时间查询
    if (date) {
      const getDate = new Date(date);
      if (!Object.is(getDate.toString(), 'Invalid Date')) {
        querys.createAt = {
          "$gte": new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
          "$lt": new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
        }
      }
    }
    const articles = await ArticleModel.paginate(querys, options)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取文章列表成功",
      result: {
        list: articles.docs,
        pagination: {
          currentPage: articles.page,
          pageSize: articles.limit,
          total: articles.total,
          totalPage: articles.pages
        }
      }
    }
  }

  // 创建文章
  static async create(ctx) {
    const article = ctx.request.body

    if (!article.title || !article.content) {
      return ctx.status(400).send("文章标题或内容为空");
    }

    await new ArticleModel(article).save().then(() => {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "创建文章成功"
      }
    }).catch(() => {
      ctx.throw(400, '创建文章失败')
    })
  }

  // 获取文章
  static async get(ctx) {
    const id = ctx.params.id
    // 判断来源
    const isFindById = Object.is(Number(id), NaN)

    let result
    if (isFindById) {
      result = await
      ArticleModel.findById(id, select)
    } else {
      result = await ArticleModel.findOne({id: id, state: 1}, select).populate('category tag').exec()
    }
    // 是否查找到
    if (!result) {
      return ctx.throw(404, "无法找到对应ID的文章")
    }

    // 每请求一次，浏览次数都要增加
    if (!isFindById) {
      result.meta.views += 1;
      result.save();
    }
    let newResult = result.toObject()
    // 按照tag请求相似文章
    if (!isFindById && result.tag.length) {
      let related = await ArticleModel.find({state: 1, tag: {$in: result.tag.map(t => t._id)}}, select)
      newResult.related = related
    }
    // 成功回应
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取文章成功",
      result: newResult
    }
  }

  // 更新文章
  static async update(ctx) {
    const id = ctx.params.id
    const article = ctx.request.body

    // 验证
    if (!article.title || !article.content) {
      return ctx.throw(400, '文章标题或内容为空')
    }
    // 重置信息
    delete article.meta
    delete article.createAt
    delete article.updateAt

    let result = await ArticleModel.findByIdAndUpdate(id, article, {new: true, select})

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "文章修改成功",
      result
    }
  }

  // 更新文章状态
  static async patch(ctx) {
    const {id, state} = ctx.request.body
    let isExist = await
    ArticleModel.findOne({_id: id})
    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "文章ID不存在"
      }
      return
    }

    let result = await ArticleModel.update({'_id': id}, {$set: {state}}, {multi: true})
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "更新文章状态成功"
    }
  }

  // 删除文章
  static async delete(ctx) {
    const id = ctx.params.id

    let isExist = await
    ArticleModel.findOne({_id: id})

    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "文章ID不存在"
      }
      return
    }
    await ArticleModel.findByIdAndRemove(id)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "文章删除成功",
    }
  }
}

module.exports = Article