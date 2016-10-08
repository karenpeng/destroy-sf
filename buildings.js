const VERTEX_SIZE = 2 * 2 + 1 + 3 + 4
// vertex format:
//  position: uint16[2]
//  height: uint8
//  normal: uint8[3]
//  id: uint32

module.exports = function initBuildings (regl, rawData) {
  const NUM_VERTS = rawData.length / VERTEX_SIZE
  const vbuffer = regl.buffer(rawData)

  return regl({
    frag: `
    precision mediump float;
    varying vec3 N;
    void main () {
      gl_FragColor = vec4(
        0.5 * (N + 1.0),
        1);
    }
    `,

    vert: `
    precision mediump float;
    attribute vec2 latlon;
    attribute vec4 hnormal;
    attribute float id;
    uniform mat4 projection, view;
    varying vec3 N;
    void main() {
      float height = 0.0125 * hnormal.x;
      vec3 normal = normalize(hnormal.yzw - 0.5);
      vec3 P = vec3(
        latlon.x - 0.5,
        height,
        latlon.y - 0.5);
      N = normal;
      gl_Position = projection * view * vec4(P, 1);
    }
    `,

    attributes: {
      latlon: {
        buffer: vbuffer,
        size: 2,
        stride: VERTEX_SIZE,
        offset: 0,
        type: 'uint16',
        normalized: true
      },
      hnormal: {
        buffer: vbuffer,
        size: 4,
        stride: VERTEX_SIZE,
        offset: 4,
        type: 'uint8',
        normalized: true
      },
      id: {
        buffer: vbuffer,
        size: 1,
        stride: VERTEX_SIZE,
        offset: 8,
        type: 'uint32'
      }
    },

    cull: {
      enable: true
    },

    frontFace: 'cw',

    count: NUM_VERTS
  })
}
