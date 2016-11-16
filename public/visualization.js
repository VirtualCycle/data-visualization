function getData (category, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/data/' + category, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText)
      var arr = []
      for (key in response) {
        var obj = {}
        obj['key'] = key
        obj['value'] = parseInt(response[key])
        arr.push(obj)
      }
      callback(arr)
    }
  }
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
}

function drawBar (data) {
  values = []
  data.forEach(element => {
    values.push(element.value)
  })
  var widthScale = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([0, 1100])

  var canvas = drawCanvas(data)
  var elements = canvas.selectAll('g')
    .data(data)
    .enter()
    .append('g')
  var rect = elements.append('rect')
    .data(data)
    .attr('width', function (d) {
      console.log(d.value)
      return widthScale(d.value)
    })
    .attr('height', 500 / data.length - 1)
    .attr('x', 20)
    .attr('y', function (d, i) {
      return 500 / data.length * i + 10
    })
    .attr('fill', 'black')
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

function drawCanvas (data) {
  var width = 1200
  var height = 550
  d3.select('svg').remove()

  var canvas = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')

  return canvas
}

function draw () {
  var cat = document.getElementById('category')
  var catType = cat.options[cat.selectedIndex].value
  var chart = document.getElementById('chartType')
  var chartType = chart.options[chart.selectedIndex].value

  getData(catType, window['draw' + chartType])
}
draw()
