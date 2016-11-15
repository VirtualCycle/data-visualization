function getData (type, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/data/' + type, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText)
      var obj = {}
      for (key in response) {
        obj[key] = parseInt(response[key])
      }
      callback(obj)
    }
  }
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
}

function drawBar (data) {
  console.log(data, '\ndrawing bar chart')
}

function drawColumn (data) {
  console.log(data, '\ndrawing column chart')
}

function drawPie (data) {
  console.log(data, '\ndrawing Pie chart')
}

function drawLine (data) {
  console.log(data, '\ndrawing Line chart')
}

function drawArea (data) {
  console.log(data, '\ndrawing Area Chart')
}

function drawScatter (data) {
  console.log(data, '\ndrawing Scatter chart')
}

function draw () {
  var cat = document.getElementById('category')
  var catType = cat.options[cat.selectedIndex].value
  var chart = document.getElementById('chartType')
  var chartType = chart.options[chart.selectedIndex].value
  getData(catType, window['draw' + chartType])
}
draw()
// getData('cuisine')
