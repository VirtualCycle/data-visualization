var fs = require('fs')
fs.readFile('dataset.json', 'utf8', (err, data) => {
  if (err) { console.log(err)}else {
    importData(JSON.parse(data))
  }
})
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
  client.sadd('boroughs', borough, redis.print)
  // client.sadd(borough, id, redis.print)
  client.hincrby('borough_counts', borough, 1, redis.print)
}

// function to set cuisine in redis
function setCuisine (cuisine, id) {
  // client.incr(cuisine + '_counter') // count the number of restaurants by cuisine
  client.sadd('cuisines', cuisine, redis.print)
  client.hincrby('cuisine_counts', cuisine, 1, redis.print)
// client.sadd(cuisine, id, redis.print)
}

function setGrades (grades, id) {
  if (grades.length !== 0) {
    client.hincrby('grades', grades[0].grade.toString(), 1)
    client.hincrby('score', JSON.stringify(grades[0].score), 1)
  }
}

function flushData () {
  client.flushdb(function (err, succeeded) {
    console.log(succeeded)
  })
}
// flushData() // use this to flush the entire db
