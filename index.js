const express = require('express')
const bodyParser = require('body-parser')

const config = require('./config')
const helper = require('./lib/helper')

const app = express()

const db = require('knex')({
  client: 'mysql',
  connection: config.db,
  debug: true,
  wrapIdentifier(value) {
    // camelCase => snake_case
    return '`' + helper.camelToSnake(value) + '`'
  },
  postProcessResponse(result) {
    if (result instanceof Array) {
      // result = [1, 2, 3]
      // result = [{ id: 1, std_code: '001' }, { id: 1, std_code: '001' }]
      // result =  [{ id: 1, stdCode: '001' }, { id: 1, stdCode: '001' }]
      return result.map(row => typeof row === 'number' ? row : Object.keys(row).reduce((p, k) => {
        p[helper.snakeToCamel(k)] = row[k]
        return p
      }, {}))
    } else {
      // result = { id: 1, std_code: '001' }
      // result = { id: 1, stdCode: '001' }
      return Object.keys(result).reduce((p, k) => {
        p[helper.snakeToCamel(k)] = result[k]
        return p
      }, {})
    }
  },
})

app.get('/', (req, res) => {
  res.send({ ok: 1 })
})

app.use((req, res, next) => {
  req.db = db
  next()
})

app.use('/api', [bodyParser.json()], require('./api'))

app.listen(config.server.port, () => {
  console.log('ready on', config.server.port)
})
