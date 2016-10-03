const nodes = require('./nodes')
const ways = require('./ways')
const relations = require('./relations')
const cleanPSLG = require('clean-pslg')
const cdt2d = require('cdt2d')

const geoCells = []
const geoPoints = []

const geoPointLabels = {}

function addGeoPoint (p) {
  const x = Math.round(p[0])
  const y = Math.round(p[1])
  const id = x + ',' + y
  if (id in geoPointLabels) {
    return geoPointLabels[id]
  }
  const offset = geoPoints.length
  geoPoints.push([x, y])
  return offset
}

Object.keys(relations).forEach(function (relId) {
  const relation = relations[relId]

  const points = []
  const edges = []

  const pointOffset = {}

  function addPoint (id) {
    if (id in pointOffset) {
      return pointOffset[id]
    }
    const offset = points.length
    points.push(nodes[id])
    return offset
  }

  function addEdge (a, b) {
    edges.push([
      addPoint(a),
      addPoint(b)
    ])
  }

  relation.forEach(function (wayId) {
    const way = ways[wayId]
    if (!way) {
      return
    }
    for (let i = 1; i < way.length; ++i) {
      addEdge(way[i - 1], way[i])
    }
  })

  cleanPSLG(points, edges)

  const cells = cdt2d(points, edges, {
    exterior: false
  })

  cells.forEach(function (c) {
    geoCells.push([
      addGeoPoint(points[c[0]]),
      addGeoPoint(points[c[1]]),
      addGeoPoint(points[c[2]])
    ])
  })
})

console.log(JSON.stringify({
  cells: geoCells,
  positions: geoPoints
}))
