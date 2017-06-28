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
  const { name, url, description } = req.body
  database('folders').insert({name: name}, 'id')
  .then(folder => {
    console.log(folder);
    database('urls').insert({url: url,
                            description: description,
                            folder_id: folder[0]}, 'id')
    .then(url => {
      res.status(201).json(req.body)
    })
  })

  .catch(error => res.status(500).json({error}))
}


module.exports = {
  folders: folders,
  newFolder: newFolder
}
