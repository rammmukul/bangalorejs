const redis = require('redis')
const url = require('url')
const {promisify} = require('util')

const redisURL = url.parse('redis://rediscloud:nW2uWZSh6dFJpKfDjqqkoRWCKOv5OEUD@redis-17508.c44.us-east-1-2.ec2.cloud.redislabs.com:17508')
const client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true})
client.auth(redisURL.auth.split(':')[1])

client.on('connect', function () {
  console.log('connected')
})

const hmset = promisify(client.hmset).bind(client)
const hget = promisify(client.hget).bind(client)
const lpush = promisify(client.lpush).bind(client)
const lrange = promisify(client.lrange).bind(client)
const lset = promisify(client.lset).bind(client)
const sadd = promisify(client.sadd).bind(client)
const smembers = promisify(client.smembers).bind(client)
const lpop = promisify(client.lpop).bind(client)

module.exports = {
  hmset, hget, lpush, lrange, lset, sadd, smembers, lpop
}
