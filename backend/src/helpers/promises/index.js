const has = require('lodash/has')

function isBluebirdPromise (promise = Promise) {
  return has(promise, 'version')
}

module.exports = {
  isBluebirdPromise,
}
