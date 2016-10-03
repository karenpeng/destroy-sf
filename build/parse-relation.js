var fs = require('fs')
var through = require('through2')
var parseOSM = require('osm-pbf-parser')

var osm = parseOSM()
var first = true

//var test = []
const parser = through.obj(function (items, enc, next) {
  items.forEach(function (item) {
    if (item.type === 'relation' && (
      item.tags.type === 'multipolygon' ||
      item.tags.type === 'building' ||
      item.tags.type === 'polygon')) {
      console.log(`${
        first ? '' : ','
      }"${item.id}":[${
        item.members.map(function(item) {
          return item.id
      })}]`)
      first = false
      // if(test.indexOf(item.tags.type) === -1)
      // console.log(item.tags.type)
      // test.push(item.tags.type)
    }
  })
  next()
})
parser.on('end', function () {
  console.log('}')
})

console.log('{')
fs.createReadStream('./sf.pbf')
  .pipe(osm)
  .pipe(parser)
