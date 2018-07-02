module.exports = async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept,X-Requested-With, Origin')
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Allow', 'PUT, PATCH, POST, GET, DELETE ,OPTIONS')
    ctx.set('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE ,OPTIONS')
    ctx.set('Access-Control-Max-Age', 86400)
    await next()
}