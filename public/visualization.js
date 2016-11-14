function fetchData () {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/data/restaurants/Manhattan', true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText)
      response.forEach(element => {
        getDetails(element)
      })
    }
  }
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
}
fetchData()

function getDetails (restaurant_id) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/data/restaurant/details/' + restaurant_id, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = xhr.responseText
      console.log(response)
    }
  }
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
}
