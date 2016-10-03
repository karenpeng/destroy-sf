const regl = require('regl')({
  extensions: 'OES_element_index_uint'
})
const camera = require('regl-camera')(regl, {
  distance: 8
})
// const geometry = require('./geometry.json')
const flatWays = require('./flat-ways.json')

const positions = (function () {
  const result = []
  Object.keys(flatWays).forEach(function (id) {
    const way = flatWays[id]
    for (let i = 2; i < way.length; i += 2) {
      result.push(
        way[i - 2],
        way[i - 1],
        way[i],
        way[i + 1])
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

      vec2 p2d = position / 32768.0 - 1.0;

      vec3 p3d = vec3(
        p2d.x,
        0,
        p2d.y);
      gl_Position = projection * view * vec4(p3d, 1);
    }
    `,

    attributes: {
      position: positions
    },

    uniforms: {
      time: ({tick}) => 0.01 * tick
    },

    lineWidth: 1,

    count: positions.length / 2,
    primitive: 'lines'
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
