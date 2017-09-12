const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express()
const router = express.Router()
const logger = require('morgan')
const consul = require('consul')({ host: process.env.CONSUL || '172.31.7.114'})

let known_zeta_instances = []

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  res.status(200).json({ data: {
    message: {
      title: 'start',
      role: 'alpha'
    }
  }})
})

router.get('/zeta', (req, res, next) => {
  res.status(200).json(known_zeta_instances)
})

router.get('/data', (req, res, next) => {
  fetch('http://localhost:4000/secrets')
  .then(response => response.json())
  .then(body => res.status(200).json(body))
  .catch(e => res.status(500).json({error: e}))
})

app.use('/', router)
app.listen(3001, () => {
  console.log('Listening on port: 3001')
})

const watcher = consul.watch({
  method: consul.health.service,
  options: {
    service: 'zeta',
    passing: true
  }
})

watcher.on('change', data => {
  console.log('Change on zeta service:', data.length)
  known_zeta_instances = [];
  known_zeta_instances = data.map(s => s.Service.Address + ':' + s.Service.Port)
})

watcher.on('error', err => console.error('watch error', err))

