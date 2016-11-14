const express = require('express')
const redis = require('redis')
const path = require('path')
const IO = require('./io-square-redis')
const fs = require('fs')
const bodyparser = require('body-parser')
IO.redis.setClient(2)
var app = express()
const http = require('http').Server(app)
const sio = require('socket.io')(http)

app.use(express.static(path.resolve('.') + '/public'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))

app.get('/', function (req, res) {
  res.sendFile(path.resolve('.') + 'public/index.html')
})

const parse = obj => {
  return {
    'address': JSON.parse(JSON.stringify(obj.address)),
    'borough': obj.borough,
    'cuisine': obj.cuisine,
    'grades': JSON.parse(JSON.stringify(obj.grades)),
    'name': obj.name,
    'id': obj.restaurant_id
  }
}
// app.get('/data/all', function (req, res) {

// IO.redis.hgetall('restaurants').map(v => {
//   for (i in v) {
//     v[i] = JSON.parse(v[i])
//   }
//   return v
// }).then(v => {
//   // console.log(v)
//   res.send(v)
// // res.end()
// })
// })

sio.on('connection', function (socket) {
  socket.on('download', function () {
    IO.redis.hgetall('restaurants').then(v => {
      sio.emit('download', v)
    })
  })
})

app.get('/data/boroughs', function (req, res) {
  IO.redis.smembers('boroughs').then(v => {
    res.send(v)
  })
})

app.get('/data/borough/count/:name', function (req, res) {
  var boroughName = req.params.name
  IO.redis.get(boroughName + '_counter').then(v => {
    res.send(v)
  })
})

app.get('/data/restaurants/:borough_name', function (req, res) {
  var borough_name = req.params.borough_name
  IO.redis.smembers(borough_name).then(v => {
    res.send(v)
  })
})

app.get('/data/restaurant/details/:id', function (req, res) {
  var id = req.params.id
  IO.redis.hget('restaurants', id).then(v => {
    res.send(v)
  })
})

const port = 3000
http.listen(port, () => {
  console.log('Running on port ' + port)
})
