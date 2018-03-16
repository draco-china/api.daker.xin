/**
 * @file mongodb数据库管理模块
 */
const mongoose = require('mongoose')
const config = require('../config/index')

mongoose.Promise = global.Promise

exports.mongoose = mongoose

exports.connect = () => {
    mongoose.connect(config.db.url, config.db.options)
    console.log()
    // 连接成功
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connection open to ' + config.db.url)
    })

    // 连接失败
    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error: ' + err)
    })

    // 断开连接
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected')
    })

    return mongoose
}