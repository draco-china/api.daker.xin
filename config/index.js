const key = require('../key')

module.exports = {
  db: {
    url: key.db.url,
    options: {
      user: key.db.user,
      pass: key.db.pass,
      auth: {
        authSource: key.db.auth.authSource,
        authMechanism: key.db.auth.authMechanism
      }
    }
  },
  token: key.token,
  baidu: {
    site: key.baidu.site,
    token: key.baidu.site
  },
  upload: {
    destination:  key.upload.destination,
    path: key.upload.path
  }
}