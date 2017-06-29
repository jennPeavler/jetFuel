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
    database('urls').insert({url: url,
                            description: description,
                            folder_id: folder[0]}, 'id')
    .then(url => {
      let response = Object.assign({}, req.body, {id: url[0]})
      res.status(201).json(response)
    })
  })

  .catch(error => res.status(500).json({error}))
}

const retrieveFolderUrls = (req, res) => {
  const { id } = req.params
  database('urls').where('folder_id', id).select()
  .then(urls => {
      if (urls.length) {
        res.status(200).json(urls);
      } else {
        res.status(404).json({
          error: `Could not find urls with folder id ${id}`
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    })
}


module.exports = {
  folders: folders,
  newFolder: newFolder,
  retrieveFolderUrls: retrieveFolderUrls
}
