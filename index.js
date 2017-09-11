const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express()
const router = express.Router()
const logger = require('morgan')

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
