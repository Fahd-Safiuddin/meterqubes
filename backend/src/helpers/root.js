const path = require('path')

module.exports = (...paths) => {
  const _root = path.resolve(__dirname, '..', '..')
  return path.join(_root, ...paths)
}
