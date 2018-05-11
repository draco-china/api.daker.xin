/**
 * @desc 用户及权限数据模型
 * @author Daker(Daker.zhou@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const Schema = mongoose.Schema
const md5 = require('md5')

const UserSchema = new Schema({
  // 用户名
  username: {type: String, default: ''},

  // 密码
  password: {type: String, default: ''},

  // 签名
  slogan: {type: String, default: ''},

  // 头像
  gravatar: {type: String, default: ''},

  // 扩展属性
  extends: [{
    name: {type: String, validate: /\S+/},
    value: {type: String, validate: /\S+/}
  }]
})

module.exports = mongoose.model('User', UserSchema)