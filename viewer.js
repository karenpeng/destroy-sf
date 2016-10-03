const regl = require('regl')()
const camera = require('regl-camera')(regl, {
  distance: 8
})
const flatWays = require('./flat-ways.json')

function unpack (p) {
  return p / 32768 - 1
}

const positions = (function () {
  const result = []
  Object.keys(flatWays).forEach(function (id) {
    const way = flatWays[id]
    for (let i = 2; i < way.length; i += 2) {
      result.push(
        unpack(way[i - 2]),
        unpack(way[i - 1]),
        unpack(way[i]),
        unpack(way[i + 1]))
    }
  })
  return result
})()

const map = {
  thickness: 3,

  draw: regl({
    frag: `
    precision mediump float;
    void main () {
      gl_FragColor = vec4(0, 1, 1, 1);
    }
    `,

    vert: `
    precision mediump float;
    attribute vec2 position;
    uniform mat4 projection, view;
    uniform float time;
    void main() {
      vec3 p3d = vec3(
        position.x,
        0,
        position.y);
      gl_Position = projection * view * vec4(p3d, 1);
    }
    `,

    attributes: {
      position: positions
    },

    uniforms: {
      time: ({tick}) => 0.01 * tick
    },

    primitive: 'lines',

    lineWidth: 1,

    count: positions.length / 2
  })
}

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  camera(() => {
    map.draw()
  })
})
