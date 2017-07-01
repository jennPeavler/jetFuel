const express = require('express')
const app = express()
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser')
const api = require('./api')


app.use(bodyParser.json());

app.use('/assets', express.static(path.join(__dirname, '../client/assets/')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/index.html')))

app.use('/api/v1', router)

app.get('/:id', api.reRouteLink)

app.listen(3000, function () {
  console.log('Jetfuel server listening on port 3000!')
})

module.exports = app
