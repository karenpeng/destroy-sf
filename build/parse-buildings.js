const fs = require('fs')
const path = require('path')
const through = require('through2')
const parseOSM = require('osm-pbf-parser')

let first = true
console.log('[')
fs.createReadStream(path.join(__dirname, './sf.pbf'))
  .pipe(parseOSM())
  .pipe(through.obj(function (items, enc, next) {
    items.forEach(function (item) {
      if (item.type === 'way' &&
          item.tags.building) {
        console.log(`${first ? '' : ','}${JSON.stringify({
          p: item.refs,
          t: item.tags
        })}`)
        first = false
      }
    })
    next()
  }))
