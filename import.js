var fs = require('fs')
var data = JSON.parse(fs.readFileSync('dataset.json'))
var redis = require('redis')
var client = redis.createClient({port: 6379, host: '127.0.0.1', db: 2})

function importData (data) {
  for ( let i = 0; i < data.length; i++) {
    let temp = data[i]
    client.incr('counter', function (err, reply) {
      client.hset('restaurants', data[i].restaurant_id, JSON.stringify(temp), function (err, reply) {
        // console.log(reply)
        setBorough(data[i].borough, data[i].restaurant_id)
        setCuisine(data[i].cuisine, data[i].restaurant_id)
        setGrades(data[i].grades, data[i].restaurant_id)
      })
    })
  }
}

function setBorough (borough, id) {
  // client.incr(borough + '_counter') // count the number of restaurants in each borough
  client.sadd('boroughs', borough, function (err, reply) {
    console.log(reply)
  })
  client.sadd(borough, id, function (err, reply) {
    console.log(reply)
  })
}

// function to set cuisine in redis
function setCuisine (cuisine, id) {
  // client.incr(cuisine + '_counter') // count the number of restaurants by cuisine
  client.sadd('cuisines', cuisine, function (err, reply) {
    console.log(reply)
  })
  client.sadd(cuisine, id, function (err, reply) {
    console.log(reply)
  })
}

function setGrades (grades, id) {
  client.hset('grades', id, JSON.stringify(grades), function (err, reply) {
    console.log(reply)
  })
}

function flushData () {
  client.flushdb(function (err, succeeded) {
    console.log(succeeded)
  })
}
// flushData() // use this to flush the entire db
importData(data) // use this to fill data in redis
