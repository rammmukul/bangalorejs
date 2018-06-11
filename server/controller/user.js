const util = require('../model/utils')
const Redis = require('../model/redis')

const user = {
  login: (req, res) => {
    util.saveUserInfo(req.body).then(() => {
      res.status(200).send('success')
    })
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.end()
    })
  },

  getUserInfo: (req, res) => {
    Redis.lrange('admins', 0, -1).then((admins) => {
      const { email } = req.body
      const isAdmin = admins.filter((admin) => admin === email)[0]
      if (isAdmin) {
        req.session.admin = email
      } else {
        req.session.user = email
      }
      util.getUserProfile(email).then((obj) => {
        res.json(JSON.parse(obj))
      })
    })
  }
}

module.exports = user
