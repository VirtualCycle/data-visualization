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
        if (category == 'scoreScatter') {
          obj['value'] = JSON.parse(response[key])
        }else {
          obj['value'] = parseInt(response[key])
        }
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
  data.sort(function (a, b) {
    return b.value - a.value
  })

  data.forEach(element => {
    values.push(element.value)
  })

  var widthScale = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([1, 800])
  var heightScale = function () {
    var height = 550 / data.length - 2
    if (height > 50) {
      return 50
    }
    return height
  }

  var color = d3.scaleOrdinal(d3.schemeCategory10)

  var canvas = drawCanvas()
  var elements = canvas.selectAll('g')
    .data(data)
    .enter()
    .append('g')
  var rect = elements.append('rect')
    .data(data)
    .attr('width', 0)
    .attr('height', heightScale())
    .attr('x', 170)
    .attr('y', function (d, i) {
      return 550 / data.length * i + 10
    })
    .attr('fill', function (d, i) {
      return color(i)
    })

  rect.transition()
    .duration(1500)
    .attr('width', function (d) {
      return widthScale(d.value)
    })

  elements.append('text')
    .style('text-anchor', 'end')
    .attr('x', 160)
    .attr('y', function (d, i) {
      return (550 / data.length * i + 10) + heightScale() / 2
    })
    .attr('dy', '.35em')
    .attr('id', 'states')
    .text(function (d) {
      return d.key
    })
}

function drawColumn (data, category) {
  values = []
  data = aggregateData(data, category)
  data.sort(function (a, b) {
    return b.value - a.value
  })

  data.forEach(element => {
    values.push(element.value)
  })

  var heightScale = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([1, 450])

  var color = d3.scaleOrdinal(d3.schemeCategory10)

  var canvas = drawCanvas()
  var elements = canvas.selectAll('g')
    .data(data)
    .enter()
    .append('g')
  var rect = elements.append('rect')
    .data(data)
    .attr('width', 550 / data.length - 10)
    .attr('height', 0)
    .attr('x', function (d, i) {
      return 550 / data.length * i + 100
    })
    .attr('y', 500)
    .attr('fill', function (d, i) {
      return color(i)
    })

  rect.transition()
    .duration(1500)
    .attr('y', function (d) {
      return 500 - heightScale(d.value)
    })
    .attr('height', function (d) {
      return heightScale(d.value)
    })

  elements.append('text')
    .style('text-anchor', 'end')
    .attr('x', -510)
    .attr('y', function (d, i) {
      return (550 / data.length * i + 100) + (550 / data.length - 10) / 2
    })
    .attr('id', 'states')
    .text(function (d) {
      return d.key
    })
    .attr('transform', function (d) {
      return 'rotate(-90)'
    })
}

function drawPie (data, category) {
  var canvas = drawCanvas()
  data = aggregateData(data, category)

  var width = 1000
  var height = 550
  var radius = Math.min(width, height) / 2
  canvas.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  var color = d3.scaleOrdinal(d3.schemeCategory10)

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
    .style('fill', function (d, i) {
      return color(i)
    })

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

function drawLine (data, category) {
  var canvas = drawCanvas()
  var temp = aggregateData(data, category)
  var dates = temp.shift()
  var data = temp.shift()
  var minDate = temp.shift()
  var maxDate = temp.shift()

  var dateScale = d3.scaleTime()
    .domain([+minDate, +maxDate])
    .range([0, 800])

  var color = d3.scaleOrdinal(d3.schemeCategory10)

  var x = d3.scaleTime()
    .domain([+minDate, +maxDate])
    .rangeRound([0, 1000])

  var y = d3.scaleLinear()
    .domain([0, 60])
    .rangeRound([500, 0])

  var g = canvas.append('g')

  for (var i = 0; i < data.length; i++) {
    g.append('path')
      .datum(data[i].value)
      .attr('class', 'line' + i)
      .attr('d', line)
      .style('stroke', function () {
        return color(i)
      })

    var line = d3.line()
      .x(function (d) {
        return x(d.date['$date'])
      })
      .y(function (d) { return y(d.score); })
  }

  var legend = canvas.selectAll('.legend').filter(i.toString())
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend' + i)

  var text = legend.append('text')
    .attr('x', 800)
    .attr('y', function (d, i) {
      return i * 15 + 50
    })
    .text(function (d) {
      return d.key
    })
  var rect = legend.append('rect')
    .attr('x', 780)
    .attr('y', function (d, i) {
      return i * 15 - 7.5 + 50
    })
    .attr('width', '15px')
    .attr('height', '10px')
    .attr('fill', function (d, i) {
      return color(i)
    })
}

function drawArea (data, category) {
  var canvas = drawCanvas()
  var temp = aggregateData(data, category)
  var dates = temp.shift()
  var data = temp.shift()
  var minDate = temp.shift()
  var maxDate = temp.shift()

  var dateScale = d3.scaleTime()
    .domain([+minDate, +maxDate])
    .range([0, 800])

  var color = d3.scaleOrdinal(d3.schemeCategory10)
}

function drawScatter (data, category) {
  var canvas = drawCanvas()
  var temp = aggregateData(data, category)
  var dates = temp.shift()
  var data = temp.shift()
  var minDate = temp.shift()
  var maxDate = temp.shift()

  var dateScale = d3.scaleTime()
    .domain([+minDate, +maxDate])
    .range([10, 860])
  var scoreScale = d3.scaleLinear()
    .domain([-1, 50])
    .range([0, 450])
  var color = d3.scaleOrdinal(d3.schemeCategory10)

  for (var i = 0; i < data.length; i++) {
    console.log(JSON.stringify(data[i].value))
    var str = '#' + i.toString()
    var elements = canvas.selectAll('.circles').filter(i.toString())
      .data(data[i].value)
      .enter()
      .append('g')
      .attr('class', 'circles' + i)

    var circles = elements.append('circle')
      .attr('cx', function (d) {
        return dateScale(+d.date['$date'])
      })
      .attr('cy', function (d) {
        return 500 - scoreScale(d.score)
      })
      .attr('r', 6)
      .attr('fill', function () {
        return color(i)
      })
      .style('opacity', '0.7')
      .attr('id', function (d) {
        return d.score
      })
  }
  var legend = canvas.selectAll('.legend').filter(i.toString())
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend' + i)

  var text = legend.append('text')
    .attr('x', 800)
    .attr('y', function (d, i) {
      return i * 15 + 50
    })
    .text(function (d) {
      return d.key
    })
  var rect = legend.append('rect')
    .attr('x', 780)
    .attr('y', function (d, i) {
      return i * 15 - 7.5 + 50
    })
    .attr('width', '15px')
    .attr('height', '10px')
    .attr('fill', function (d, i) {
      return color(i)
    })
}

function aggregateData (data, category) {
  if (category === 'scoreScatter') {
    minmax = []
    var dates = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].value.length; j++) {
        minmax.push(parseInt(data[i].value[j].date['$date']))
        dates.push(new Date(data[i].value[j].date['$date']))
      }
    }
    minmax.sort(function (a, b) {
      return a - b
    })
    min = new Date(minmax[0])
    max = new Date(minmax[minmax.length - 1])
    return [dates, data, min, max]
  }
  if (category === 'cuisine') {
    var arr = []
    data.sort(function (a, b) {
      return b.value - a.value
    })
    var total = 0
    for (var i = 0; i < data.length; i++) {
      if (i < 17) {
        if (data[i].key.indexOf('Latin') !== -1) {
          arr.push({'key': 'Latin',
          'value': data[i].value})
        } else if (data[i].key.indexOf('Other') !== -1) {
          total += data[i].value
        } else {
          arr.push(data[i])
        }
      } else {
        total += data[i].value
      }
    }
    arr.push({'key': 'Others', 'value': total})
    // console.log(data, arr)
    return arr
  }

  if (category === 'score') {
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
    arr.sort(function (a, b) {
      return a.value - b.value
    })
    return arr
  } else return data
}

function drawCanvas (data) {
  var width = 1000
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

  if (chartType == 'Scatter' || chartType == 'Line' || chartType == 'Area') {
    getData('scoreScatter', window['draw' + chartType])
  } else {
    getData(catType, window['draw' + chartType])
  }
}
draw()
