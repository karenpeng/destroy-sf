var fs = require('fs')
var through = require('through2')
var parseOSM = require('osm-pbf-parser')

var osm = parseOSM()
var first = true

const parser = through.obj(function (items, enc, next) {
  items.forEach(function (item) {
    if (item.type === 'node') {
      console.log(`${
        first ? '' : ','
      }"${item.id}":[${item.lat},${item.lon}]`)
      first = false
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
