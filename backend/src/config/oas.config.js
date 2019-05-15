const fromRoot = require('../helpers/root')

module.exports = {
  file: fromRoot('swagger.yml'),
  endpoint: '/openapi.json',
  uiEndpoint: '/docs',
}
