/**
 * @desc 分类模型
 * @author Daker(Daker.zhou@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const CategorySchema = new Schema({

  // 图标
  icon: String,

  // 分类名称
  name: {type: String, required: true, validate: /\S+/},

  // 模块链接
  slug: {type: String, required: true, validate: /\S+/},

  // 描述
  description: String,

  // 父分类
  category: {type: Schema.Types.ObjectId, ref: 'Category'},

  // 创建时间
  create_at: {type: Date, default: Date.now},

  // 修改时间
  update_at: {type: Date},

  // 扩展属性
  extends: [{
    name: {type: String, validate: /\S+/},
    value: {type: String, validate: /\S+/}
  }]
})

CategorySchema.set('toObject', {getters: true})

// 翻页 + 自增ID插件配置
CategorySchema.plugin(paginate);
CategorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
CategorySchema.pre('save', function (next) {
  this.update_at = Date.now()
  next()
})
CategorySchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {update_at: Date.now()})
  next()
})

module.exports = mongoose.model('Category', CategorySchema)