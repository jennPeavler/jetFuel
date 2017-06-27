const express = require('express')
const router = express.Router()
const api = require('./api')

router.get('/folders', api.folders)
router.post('/folders', api.newFolder)

module.exports = router;
