const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

const folders = (req, res) => {
  database('folders').select()
  .then(folders => {
    res.status(200).json(folders);
  })
  .catch(error => {
    console.error('error: ', error)
    res.status(500)
  });
}

const newFolder = (req, res) => {
  console.log(req.body.name)
  const folderName = req.body
  database('folders').insert(folderName, 'id')
  .then(folder => {
    res.status(201).json({id: folder[0]})
  })
  .catch(error => {
    res.status(500).json({message: error})
  })
}


module.exports = {
  folders: folders,
  newFolder: newFolder
}
