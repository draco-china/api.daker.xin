/**
 * @file 用户及权限控制
 */

const jwt = require('jsonwebtoken')
const md5 = require('md5')
const UserModel = require('../models/user')
const config = require('../config')

class User {
    // 用户登陆
    static async SignIn (ctx) {
        const { username, password } = ctx.request.body
        console.log(ctx)
        //检查数据库中是否存在该用户名
        let result = await UserModel.findOne({ username })
        console.log(result)
        if (result) {
            //判断密码是否正确
            if (md5(password) === result.password) {
                let token = jwt.sign( { username, password }, config.token, { expiresIn: '3h' } ) // .split('.')[2]
                ctx.status = 200
                ctx.body = {
                    success: true,
                    message: "登录成功",
                    data: {
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
    static async SignUp (ctx) {
        const { username, password  } = ctx.request.body
        //检查数据库中是否存在该用户名
        let result = await UserModel.findOne({ username })
        if(result) {
            ctx.status = 200
            ctx.body = {
                success: false,
                message: '用户名已存在！'
            }
        } else {
            let result = await new UserModel({ username, password: md5(password) }).save()
            if(result) {
                ctx.status = 200
                ctx.body = {
                    success: true,
                    message: "用户添加成功"
                }
            }
        }
    }
}

module.exports = User
