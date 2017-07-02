const express = require('express')
const router = express.Router()
const api = require('./api')

router.get('/folders', api.folders)
router.post('/folders', api.newFolder)
router.get('/folders/:id/urls', api.retrieveFolderUrls)
router.put('/urls/:id', api.increasePopularity)
router.post('/urls', api.addNewUrl)
router.post('/folders/:name', api.newFolderName)

module.exports = router;
