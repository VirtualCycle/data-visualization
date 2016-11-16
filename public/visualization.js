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
      callback(arr, category)
    }
  }
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
}

function drawBar (data, category) {
  values = []
  data = aggregateData(data, category)

  data.forEach(element => {
    values.push(element.value)
  })

  var widthScale = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([1, 1100])

  var canvas = drawCanvas(data)
  var elements = canvas.selectAll('g')
    .data(data)
    .enter()
    .append('g')
  var rect = elements.append('rect')
    .data(data)
    .attr('width', function (d) {
      return widthScale(d.value)
    })
    .attr('height', 550 / data.length - 2)
    .attr('x', 20)
    .attr('y', function (d, i) {
      return 550 / data.length * i + 10
    })
    .attr('fill', 'black')
}

function drawColumn (data, category) {
  console.log(data, '\ndrawing column chart')
}

function drawPie (data, category) {
  var canvas = drawCanvas(data)
  data = aggregateData(data, category)
  var width = 1200
  var height = 550
  var radius = Math.min(width, height) / 2
  canvas.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0)

  var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40)

  var pie = d3.pie()
    .sort(null)
    .value(function (d) {
      return d.value
    })

  var g = canvas.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc')

  g.append('path')
    .attr('d', arc)
    .style('fill', 'blue')

  g.append('text')
    .attr('transform', function (d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .attr('dy', '.35em')
    .text(function (d) {
      if (d.data.key !== 'Missing' && d.data.key != 'Not Yet Graded') {
        return d.data.key
      }
      return 'N/A'
    })
}

function aggregateData (data, category) {
  var arr = [
    {'key': '<5',
    'value': 0},
    {'key': '6-10',
    'value': 0},
    {'key': '11-20',
    'value': 0},
    {'key': '>20',
    'value': 0}
  ]

  // if (category === 'cuisine') {

  // }

  if (category === 'score') {
    data.forEach(element => {
      if (element.key == null || element.key <= 5) {
        arr[0].value += element.value
      }
      if (element.key > 5 && element.key <= 10) {
        arr[1].value += element.value
      }
      if (element.key > 11 && element.key <= 20) {
        arr[2].value += element.value
      }
      if (element.key > 20) {
        arr[3].value += element.value
      }
    })
    return arr
  } else return data
}

function drawLine (data, category) {
  console.log(data, '\ndrawing Line chart')
}

function drawArea (data, category) {
  console.log(data, '\ndrawing Area Chart')
}

function drawScatter (data, category) {
  console.log(data, '\ndrawing Scatter chart')
}

function drawCanvas (data) {
  var width = 1200
  var height = 600
  d3.select('svg').remove()

  var canvas = d3.select('#visualization')
    .append('svg')
    .attr('id', 'canvas')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'outline: thin solid gray;')
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
