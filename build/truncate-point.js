const bounds = [
  [ 37.44, -122.74 ],
  [ 37.96, -122.01 ] ]
const bits = 16

const mult = Math.pow(2, bits)
function toFix (x, lo, hi) {
  return (mult * (x - lo) / (hi - lo)) | 0
}
function toFloat (y, lo, hi) {
  return y * (hi - lo) / mult + lo
}

module.exports = {
  truncate: function (lat, lon) {
    return [
      toFix(lat, bounds[0][0], bounds[1][0]),
      toFix(lon, bounds[0][1], bounds[1][1])
    ]
  },
  expand: function (point) {
    return [
      toFloat(point[0], bounds[0][0], bounds[1][0]),
      toFloat(point[1], bounds[0][1], bounds[1][1])
    ]
  }
}
