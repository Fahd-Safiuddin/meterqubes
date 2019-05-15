const zlib = require('zlib')

module.exports = {
  threshold: 1024, // default
  flush: zlib.Z_SYNC_FLUSH,
}
