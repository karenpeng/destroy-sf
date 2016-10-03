const nodes = require('./nodes')
const ways = require('./ways')

console.log('{')
const wayIds = Object.keys(ways)
for (let i = 0; i < wayIds.length; ++i) {
  const id = wayIds[i]
  const way = ways[id]
  console.log(`${i > 0 ? ',' : ''}"${id}":[${
    way.map((nodeId) => nodes[nodeId].join())
  }]`)
}
console.log('}')
