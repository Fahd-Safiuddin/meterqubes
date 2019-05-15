module.exports = function (client, database) {
  if (!client) throw new Error('Database client is required')
  if (!database) throw new Error('Database name is required')

  return {
    async dropDatabase (strictMode = false) {
      await client.query(`DROP DATABASE ${strictMode ? '' : 'IF EXISTS'} ${database}`)
      console.info('DROP DATABASE')
    },

    async createDatabase () {
      await client.query(`CREATE DATABASE ${database} ENCODING 'UTF8' TEMPLATE template0;`)
      console.info('CREATE DATABASE')
    },

    async alterDatabase () {
      await client.query(`ALTER DATABASE ${database} SET timezone TO 'UTC';`)
      console.info('ALTER DATABASE')
    },
  }
}
