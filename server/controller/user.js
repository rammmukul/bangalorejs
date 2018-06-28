const fetch = require('node-fetch')
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
    const { email } = req.body
    if (req.session) {
      util.getUserProfile(email).then((obj) => {
        res.status(200).json(JSON.parse(obj))
      })
    } else {
      res.status(403).send('resource cannot be fetched')
    }
  },

  auth: (req, res) => {
    if (!req.session.admin && !req.session.user) {
      const { email } = req.body
      return fetch('https://www.googleapis.com/userinfo/v2/me', {method: 'GET', headers: {'Authorization': `Bearer ${req.body.access_token}`}})
        .then(response => response.json())
        .then(result => {
          if (result.email === req.body.email) {
            return Redis.sismember('admins', email).then((err, isAdmin) => {
              if (err) console.error(err)
              if (isAdmin) {
                req.session.admin = email
              } else {
                req.session.user = email
              }
              return res.status(201).json(result)
            })
          }
          return res.status(401).json('login failed')
        })
        .catch(err => console.error('Error: ', err))
    }
    return res.status(200).json('session in progress')
  }
}

module.exports = user
