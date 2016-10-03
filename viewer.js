const regl = require('regl')({
  extensions: 'OES_element_index_uint'
})
const camera = require('regl-camera')(regl, {
  distance: 8
})
const buildings = require('./build/building-geom.json')

const draw = {
  buildings: initBuildings(regl)
}

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  camera(() => {
    draw.buildings()
  })
})

function initBuildings (regl) {
  const buildingPoints = []
  const buildingCells = []

  for (let id = 0; id < buildings.length; ++id) {
    const building = buildings[id]
    const height = building[0]
    const points = building[1]
    const cells = building[2]

    const N = points.length >> 1

    const bottomOffset = buildingPoints.length / 4
    const topOffset = bottomOffset + N
    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < points.length; j += 2) {
        buildingPoints.push(
          points[j] / 32768.0 - 1.0,
          i * height * 0.0001,
          points[j + 1] / 32768.0 - 1.0,
          id)
      }
    }
    for (let i = 0; i < N; ++i) {
      const i0 = i
      const i1 = (i + 1) % N

      const v00 = bottomOffset + i0
      const v01 = bottomOffset + i1
      const v10 = topOffset + i0
      const v11 = topOffset + i1

      buildingCells.push(
        v00, v01, v10,
        v10, v01, v11)
    }
    for (let i = 0; i < cells.length; ++i) {
      buildingCells.push(cells[i] + topOffset)
    }
  }

  return regl({
    frag: `
    precision mediump float;
    void main () {
      if (gl_FrontFacing) {
        gl_FragColor = vec4(0, 1, 1, 1);
      } else {
        gl_FragColor = vec4(1, 0, 1, 1);
      }
    }
    `,

    vert: `
    precision mediump float;
    attribute vec4 data;
    uniform mat4 projection, view;
    varying float id;
    void main() {
      vec3 position = data.xyz;
      float id = data.w;
      gl_Position = projection * view * vec4(position, 1);
    }
    `,

    attributes: {
      data: buildingPoints
    },

    elements: regl.elements({
      data: new Uint32Array(buildingCells),
      usage: 'static',
      primitive: 'triangles',
      type: 'uint32',
      count: buildingCells.length
    }),

    /*
    cull: {
      enable: true,
      face: 'back'
    },
    */

    frontFace: 'cw'
  })
}
