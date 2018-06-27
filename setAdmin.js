const Redis = require('./server/model/redis')

const admin = () => {
  Redis.sadd('admins', 'archanamittal0388@gmail.com')
}

admin()
