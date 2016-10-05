const fs = require('fs')
const path = require('path')
const {
  vertexCount,
  faceCount,
  buildings
} = require('./building-geom.json')

const VERTEX_SIZE = 2 * 2 + 1 + 3 + 4
// vertex format:
//  position: uint16[2]
//  height: uint8
//  normal: uint8[3]
//  id: uint32

const NUM_VERTICES = vertexCount * 6 + faceCount * 3
const data8 = new Uint8Array(NUM_VERTICES * VERTEX_SIZE)
const data16 = new Uint16Array(data8.buffer)
const data32 = new Uint32Array(data8.buffer)

var vcount = 0

function toU8 (v) {
  return Math.min(255,
    Math.max(0,
      Math.round((v + 1.0) * 128)))
}

function vpush (
  px, py,
  height,
  nx, ny, nz,
  id) {
  data16[(vcount * VERTEX_SIZE) >> 1] = px
  data16[(vcount * VERTEX_SIZE + 2) >> 1] = py

  data8[vcount * VERTEX_SIZE + 4] = height
  data8[vcount * VERTEX_SIZE + 5] = toU8(nx)
  data8[vcount * VERTEX_SIZE + 6] = toU8(ny)
  data8[vcount * VERTEX_SIZE + 7] = toU8(nz)

  data32[(vcount * VERTEX_SIZE + 8) >> 2] = id

  vcount += 1
}

buildings.forEach(([height, verts, faces], id) => {
  const VCOUNT = verts.length / 2

  function vtop (x) {
    vpush(
      verts[2 * x], verts[2 * x + 1],
      height,
      0, 1, 0,
      id)
  }

  function vbottom (x) {
    vpush(
      verts[2 * x], verts[2 * x + 1],
      0,
      0, -1, 0,
      id)
  }

  function vside (i, h, dx, dy) {
    const p0 = verts[2 * i]
    const p1 = verts[2 * i + 1]
    vpush(
      p0, p1,
      h,
      -dy, 0, dx,
      id)
  }

  // emit side of tower
  for (let i = 0; i < VCOUNT; ++i) {
    const j = (i + 1) % VCOUNT

    const p0 = verts[2 * i]
    const p1 = verts[2 * i + 1]
    const q0 = verts[2 * j]
    const q1 = verts[2 * j + 1]
    var dx = p0 - q0
    var dy = p1 - q1
    const l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    dx /= l
    dy /= l

    vside(i, 0, dx, dy)
    vside(j, 0, dx, dy)
    vside(i, height, dx, dy)
    vside(i, height, dx, dy)
    vside(j, 0, dx, dy)
    vside(j, height, dx, dy)
  }

  // emit roof
  for (let i = 0; i < faces.length; ++i) {
    vtop(faces[i])
  }

  // emit floor
  for (let i = faces.length - 1; i >= 0; --i) {
    vbottom(faces[i])
  }
})

fs.writeFile(
  path.join(__dirname, './building-geom.bin'),
  new Buffer(data8.subarray(0, vcount * VERTEX_SIZE)))
