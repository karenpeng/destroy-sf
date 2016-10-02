var fs = require('fs')
var through = require('through2')
var parseOSM = require('osm-pbf-parser')

var osm = parseOSM()
fs.createReadStream('./sf.pbf')
    .pipe(osm)
    .pipe(through.obj(function (items, enc, next) {
      items.forEach(function (item) {
        if (item.type === 'relation' && item.tags.height) {
          console.log(item)
        }
      })
      next()
    }))
