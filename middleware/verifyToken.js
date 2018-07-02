/**
 * @desc token验证
 * @author Daker(Daker.zhou@gmail.com)
 */

const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = async (ctx, next) => {
    const token = ctx.request.header.authorization

    if (!token) {
        ctx.throw(401, 'No token detected.')
    }

    let tokenContent
    try {
        tokenContent = await jwt.verify(token, config.token)
    } catch (err) {
        // Token 过期
        if (err.name === 'TokenExpiredError') {
            ctx.throw(401, 'Token expried')
        }
        // Token 验证失败
        ctx.throw(401, 'Invalid Token')
    }

    ctx.token = tokenContent
    return await next()
}

