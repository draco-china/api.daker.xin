/**
 * @desc 分类控制
 * @author Daker(Daker.zhou@gmail.com)
 */

const CategoryModel = require('../models/category')
const ArticleModel = require('../models/article')

const select = {
  '__v': false
}

class Category {
  // 创建分类
  static async create(ctx) {
    const category = ctx.request.body

    // name validate
    if (!category.name) {
      ctx.throw(400, '分类名为空')
      return
    }

    if (await CategoryModel.findOne({name: category.name}).exec()) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "分类已存在"
      }
      return
    }

    if (await CategoryModel.findOne({slug: category.slug}).exec()) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "该链接已经被使用"
      }
      return
    }

    await new CategoryModel(category).save().then(() => {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "分类创建成功"
      }
    }).catch(() => {
      ctx.throw(400, '分类创建失败')
    })
  }

  // 获取分类
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
        page: Number(currentPage),
        limit: Number(pageSize),
        select: select
      }
      const categorys = await
      CategoryModel.paginate(query, options)

      let counts = await ArticleModel.aggregate([
        {$unwind: "$category"},
        {
          $group: {
            _id: "$category",
            num_tutorial: {$sum: 1}
          }
        }
      ])

      let newDocs = categorys.docs.map(category => {
        const match = counts.find(count => {
          return String(count._id) === String(category._id)
        })
        category._doc.articleTotal = match ? match.num_tutorial : 0
        return category
      })

      ctx.status = 200
      ctx.body = {
        success: true,
        message: "获取所有分类",
        result: {
          list: newDocs,
          pagination: {
            currentPage: categorys.page,
            pageSize: categorys.limit,
            total: categorys.total,
            totalPage: categorys.pages
          }
        }
      }
    } else {
      // const categorys = await CategoryModel.find(query, select)
      const categorys = await CategoryModel.aggregate([
        {
          $lookup: {
            from: "articles",
            localField: "_id",
            foreignField: "category",
            as: "articleTotal"
          }
        },
        {$match: query},
        {$project: select}
      ])

      categorys.forEach(item => {
        item.articleTotal = item.articleTotal.length
      })

      ctx.status = 200
      ctx.body = {
        success: true,
        message: "获取所有分类",
        result: {
          list: categorys
        }
      }
    }
  }

  // 更新分类
  static async update(ctx) {
    const category = ctx.request.body
    const id = ctx.params.id

    // name validate
    if (!category.name) {
      ctx.throw(400, '分类名为空')
      return
    }

    // if new category's name duplicated
    const isExist = await CategoryModel.findOne({name: category.name})

    if (isExist && String(isExist._id) !== id) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "分类已存在",
        result: isExist
      }
    } else {

      let categoryItem = await CategoryModel.findByIdAndUpdate(id, category, {new: true, select})

      if (!categoryItem) {
        ctx.throw(404, '分类ID不存在')
      } else {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "分类更新成功",
          result: categoryItem
        }
      }
    }
  }

  // 删除分类
  static async delete(ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await
    CategoryModel.findOne({_id: id})

    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "分类ID不存在"
      }
      return
    }

    // 如果删除项为别的项的super
    let result = await
    CategoryModel.find({category: id})

    if (result.length) {
      // 更新子项的super
      await CategoryModel.find({'_id': {$in: Array.from(result, c => c._id)
    }
    }).
      update({$set: {category: isExist.category || null}})
    }

    await CategoryModel.remove({_id: id})

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "分类删除成功"
    }
  }
}

module.exports = Category