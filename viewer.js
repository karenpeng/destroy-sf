const regl = require('regl')({
  // extensions: 'OES_element_index_uint'
})
const initBuildings = require('./buildings')
const camera = require('regl-camera')(regl, {
  distance: 5
})
const draw = {
  buildings: function () {}
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

require('resl')({
  manifest: {
    buildingData: {
      type: 'binary',
      src: 'build/building-geom.bin'
    }
  },

  onDone: ({buildingData}) => {
    draw.buildings = initBuildings(
      regl,
      new Uint8Array(buildingData))
  }
})
