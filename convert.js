// The dataset was not a valid JSON object as it was not
// enclosed in {} and the elements were not comma separated
// This program converts the dataset to valid JSON
var fs = require('fs')
var data = fs.readFileSync('./primer-dataset.json').toString().split('\n').join(',\n')
var str = '[' + data + ']'
fs.writeFile('./dataset.json', str)
