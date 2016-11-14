const IO = require('io-square')
const db = require('redis')

IO.redis = {
  setClient(dbNum = 0 , auth = false , password = null , port = 6379 , host = '127.0.0.1') {
    if (auth !== true) {
      const c = db.createClient(port, host)
      c.select(dbNum, db.print)
      this.client = c
    } else {
      const c = db.createClient(port, host)
      c.auth(password, db.print)
      c.select(dbNum, db.print)
      this.client = c
    }
  },

  get(key) {
    return new IO(cb => this.client.get(key, cb))
      .map((e, v) => v)
  },

  set(key, val) {
    return new IO(cb => this.client.set(key, val, cb))
      .map((e, confirmation) => confirmation === 'OK' ? val : e)
  },

  incr(key) {
    return new IO(cb => this.client.incr(key, cb))
      .map((e, v) => v)
  },

  decr(key) {
    return new IO(cb => this.client.decr(key, cb))
      .map((e, v) => v)
  },

  append(key, value) {
    return new IO(cb => this.client.append(key, value, cb))
      .map((e, v) => v)
  },

  lpush(key, ...values) {
    return new IO(cb => this.client.lpush(key, values, cb))
      .map((e, n) => values.length === n)
  },

  rpush(key, ...values) {
    return new IO(cb => this.client.rpush(key, values, cb))
      .map((e, n) => values.length === n)
  },

  lpop(key) {
    return new IO(cb => this.client.lpop(key, cb))
      .map((e, v) => v)
  },

  rpop(key) {
    return new IO(cb => this.client.rpop(key, cb))
      .map((e, v) => v)
  },

  del(...keys) {
    return new IO(cb => this.client.del(keys, cb))
      .map((e, n) => n)
  },

  exists(...keys) {
    return new IO(cb => this.client.exists(keys, cb))
      .map((e, n) => keys.length === n) },

  hexists(key, field) {
    return new IO(cb => this.client.hexists(key, field, cb))
      .map((e, v) => v === 1)
  },

  hget(key, field) {
    return new IO(cb => this.client.hget(key, field, cb))
      .map((e, v) => v)
  },

  hgetall(key) {
    return new IO(cb => this.client.hgetall(key, cb))
      .map((e, v) => v)
  },

  hkeys(key) {
    return new IO(cb => this.client.hkeys(key))
      .map((e, v) => v)
  },

  hdel(key, field) {
    return new IO(cb => this.client.hdel(key, field, cb))
      .map((e, confirmation) => confirmation)
  },

  hmset(...args) {
    return new IO(cb => this.client.hmset(args, cb))
      .map((e, confirmation) => confirmation)
  },

  hmget(...args) {
    return new IO(cb => this.client.hmget(args, cb))
      .map((e, v) => [v])
  },

  lrange(...args) {
    return new IO(cb => this.client.lrange(args, cb))
      .map((e, v) => [v])
  },

  lrem(...args) {
    return new IO(cb => this.client.lrem(args, cb))
      .map((e, v) => v)
  },

  lset(...args) {
    return new IO(cb => this.client.lset(args, cb))
      .map((e, v) => v)
  },

  sadd(key, ...field) {
    return new IO(cb => this.client.sadd(key, field, cb))
      .map((e, v) => v)
  },

  smembers(key) {
    return new IO(cb => this.client.smembers(key, cb))
      .map((e, v) => [v])
  },
  scan(cursor, ...matchPatterns) {
    return new IO(cb => this.client.scan(cursor, matchPatterns, cb))
      .map((e, v) => [v])
  }

}

module.exports = IO
