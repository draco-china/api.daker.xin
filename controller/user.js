/**
 * @desc 用户及权限控制
 * @author Daker(Daker.zhou@gmail.com)
 */

const jwt = require('jsonwebtoken')
const md5 = require('md5')
const UserModel = require('../models/user')
const config = require('../config')

class User {
  // 用户登陆
  static async login(ctx) {
    const {username, password} = ctx.request.body

    //检查数据库中是否存在该用户名
    let result = await UserModel.findOne({username})

    if (result) {
      //判断密码是否正确
      if (md5(password) === result.password) {
        let token = jwt.sign({username, password}, config.token, {expiresIn: '3h'})
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "登录成功",
          result: {
            token
          }
        }
      } else {
        ctx.body = {
          success: false,
          message: '密码错误'
        }
      }
    } else {
      ctx.body = {
        success: false,
        message: '用户名或密码错误！'
      }
    }
  }

  // 用户注册
  static async SignUp(ctx) {
    const {username, password} = ctx.request.body
    //检查数据库中是否存在该用户名
    let result = await
    UserModel.findOne({username})
    if (result) {
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '用户名已存在！'
      }
    } else {
      let result = await
      new UserModel({username, password: md5(password)}).save()
      if (result) {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "用户添加成功"
        }
      }
    }
  }

  // 获取用户信息
  static async get (ctx) {
    // let user = await UserModel.find({}, '-_id username slogan gravatar')
    let user = await UserModel.find({}, {username: true, slogan: true, gravatar: true, _id: false})
    if (user.length) {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "用户信息获取成功",
        result: user[0]
      }
    } else {
      ctx.throw(404, '暂无用户信息')
    }
  }

  // 更新用户信息
  static async update (ctx) {
    const { username, slogan, gravatar, password, new_password = '', repeat_password = '' } = ctx.request.body
    let newUser, newPWD

    if (Boolean(new_password) && Boolean(repeat_password)) {
      // 验证密码
      if (!!password && ((!new_password || !repeat_password) || !Object.is(new_password, repeat_password))) {
        ctx.throw(400, "密码不一致或无效！")
      }

      if (!!password && [new_password, repeat_password].includes(password)) {
        ctx.throw(400, "新旧密码不可一致！")
      }

      newPWD = new_password
    } else {
      newPWD = password
    }

    let user = await UserModel.find({})

    if (user.length) {
      if (md5(password) !== user[0].password) {
        ctx.throw(401, "密码错误, 更新失败！")
      } else {
        newUser = await UserModel.findByIdAndUpdate(user[0]._id, {
          username,
          password: md5(newPWD),
          slogan,
          gravatar
        }, { new: true })
      }
    } else {
      ctx.throw(401, "用户不存在，更新失败！")
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "用户信息更新成功",
      result: newUser
    }
  }
}

module.exports = User
