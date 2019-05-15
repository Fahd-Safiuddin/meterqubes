const groupBy = require('lodash/groupBy')
const mapValues = require('lodash/mapValues')

/**
 * @async
 * @param {object} model
 * @param {string} [groupByField]
 */
async function findAssociations (model, groupByField = 'name', options = {}) {
  if (!model || !model.findAll) {
    throw new TypeError('Provided model has no findAll method')
  }

  const records = await model.findAll({
    attributes: ['id', groupByField],
    ...options,
  })
  return mapValues(groupBy(records, groupByField), '[0].id')
}

module.exports = {
  findAssociations,
}
