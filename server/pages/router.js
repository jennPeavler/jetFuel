const express = require('express')
const router = express.Router()
const pageHtml  = require('./pageHtml')

router.get('/', pageHtml.homeFile)
router.get('/folders/new', pageHtml.newFolder)

module.exports = router;
