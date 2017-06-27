const express = require('express')
const app = express()
const path = require('path')
const router = require('./router')
const pages = require('./pages/router')
const bodyParser = require('body-parser')



app.use(bodyParser.json());

app.use('/assets', express.static(path.join(__dirname, '../client/assets/')))

app.use('/', pages)

app.use('/api/v1', router)

app.listen(3000, function () {
  console.log('Jetfuel server listening on port 3000!')
})
