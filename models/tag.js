/**
 * @desc 标签数据模型
 * @author Daker(Daker.zhou@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const TagSchema = new Schema({

  // 图标
  icon: String,

  // 分类名称
  name: {type: String, required: true, validate: /\S+/},

  // 链接
  slug: {type: String, required: true, validate: /\S+/},

  // 描述
  description: String,

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

// 翻页 + 自增ID插件配置
TagSchema.plugin(paginate);
TagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
TagSchema.pre('save', function (next) {
  this.update_at = Date.now()
  next()
})
TagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {update_at: Date.now()})
  next()
})

module.exports = mongoose.model('Tag', TagSchema)