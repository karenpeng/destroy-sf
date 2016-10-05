var nodes = require('./nodes.json')
var buildings = require('./buildings.json')
var cdt2d = require('cdt2d')
var cleanPSLG = require('clean-pslg')
var simplifyPSLG = require('simplify-planar-graph')
var orient = require('robust-orientation')

var first = true
var vertexCount = 0
var faceCount = 0

console.log('{"buildings":[')
buildings.forEach(function ({p, t}) {
  var height = 10
  if (t.height) {
    height = +(t.height.split(' ')[0])
  }

  if (isNaN(height)) {
    height = 10
  }

  const rawedges = []
  const rawpoints = p.map((x, i) => {
    rawedges.push([i, (i + 1) % p.length])
    return nodes[x]
  })

  let area = 0
  for (let i = 2; i < rawpoints.length; ++i) {
    area += orient(
      rawpoints[0],
      rawpoints[i - 1],
      rawpoints[i - 2])
  }

  const {
    positions,
    edges
  } = simplifyPSLG(rawedges, rawpoints, 0.1)
  cleanPSLG(positions, edges)
  const cells = cdt2d(positions, edges, {
    exterior: false
  })

  if (area < 0) {
    const N = positions.length
    positions.reverse()
    cells.forEach((cell) => {
      const [a, b, c] = cell
      cell[0] = N - 1 - b
      cell[1] = N - 1 - a
      cell[2] = N - 1 - c

      if (orient(
        positions[cell[0]],
        positions[cell[1]],
        positions[cell[2]]) > 0) {
        const tmp = cell[0]
        cell[0] = cell[1]
        cell[1] = tmp
      }
    })
  }

  vertexCount += positions.length
  faceCount += cells.length

  console.log(`${first ? '' : ','}[${height},[${
    positions.map((q) => q.map(Math.round))
  }],[${cells}]]`)
  first = false
})
console.log(`],"vertexCount":${vertexCount},"faceCount":${faceCount}}`)
