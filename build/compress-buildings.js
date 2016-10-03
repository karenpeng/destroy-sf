const fs = require('fs')
const path = require('path')
const buildings = require('./building-geom.json')

const vertices = []
const cells = []
const buildingData = []

buildings.forEach(([height, verts, faces]) => {
  const vOffset = vertices.length
  const cOffset = cells.length
  buildingData.push(
    height,
    vOffset,
    verts.length / 2,
    cOffset,
    faces.length / 3)

  for (let i = 0; i < verts.length; ++i) {
    vertices.push(verts[i])
  }

  for (let i = 0; i < faces.length; ++i) {
    cells.push(faces[i])
  }
})

fs.writeFile(
  path.join(__dirname, './building-verts.bin'),
  new Buffer(new Uint16Array(vertices)))
fs.writeFile(
  path.join(__dirname, './building-cells.bin'),
  new Buffer(new Uint8Array(cells)))
fs.writeFile(
  path.join(__dirname, './building-data.bin'),
  new Buffer(new Uint32Array(buildingData)))
