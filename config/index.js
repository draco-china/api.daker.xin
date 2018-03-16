const key = require('../key')

module.exports = {
    db: {
        url: key.db.url,
        options: {
            user: key.db.user,
            pass: key.db.pass,
            auth : {
                authSource: key.db.auth.authSource,
                authMechanism: key.db.auth.authMechanism
            }
        }
    },
    token: key.token
}