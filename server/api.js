const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

const folders = (req, res) => {
  database('folders').select()
  .then(folders => {
    res.status(200).json(folders);
  })
  .catch(error => {
    res.status(500).send(error)
  });
}

const newFolderName = (req, res) => {
  const { name } = req.body
  database('folders').insert({name: name}, 'id')
  .then((folder) => {
    let response = Object.assign({}, req.body, {id: folder[0]})
    res.status(201).json(response)
  })
  .catch((error) => {
    res.send(error)
  })
}

const newFolder = (req, res) => {
  const { name, urls } = req.body
  database('folders').insert({name: name}, 'id')
  .then((folder) => {
    if(urls[0].url) {
      let urlPromises = []

      urls.forEach((url) => {
        urlPromises.push(insertUrlToDB(url, folder))
      })
      Promise.all(urlPromises)
      .then(data => {
        // NOTE: need to un-hardcode at some point
        req.body.urls[0].id = data[0][0]
        res.status(201).json(req.body)
      })
    } else {
      res.status(201).json({name: req.body.name})
    }
  })
  .catch(error => res.status(500).json({error}))
}

const insertUrlToDB = (url, folder) => {
  console.log(folder)
  return database('urls').insert({url: url.url,
                                  description: url.description,
                                  folder_id: folder[0]}, 'id')
}

const retrieveFolderUrls = (req, res) => {
  const { id } = req.params
  database('urls').where('folder_id', id).select()
  .then(urls => {
      if (urls.length) {
        // let response = Object.assign({}, urls, {id: id})
        // console.log(response);
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

const reRouteLink = (req, res) => {
  const { id } = req.params
  database('urls').where('id', id).select('url')
  .then(longUrl => {
    const { url } = longUrl[0]
    res.redirect(302, `${url}`)
  })
}

const increasePopularity = (req, res) => {
  const { id } = req.params
  database('urls').where('id', id).increment('popularity', 1)
  .then((data) => {
    res.status(202).send({message: 'popularity incremented'})
  })
}

const addNewUrl = (req, res) => {
  const { url, description, folder_id } = req.body
  database('urls').insert(req.body, 'id')
  .then(data => {
    let response = Object.assign({}, req.body, {id: data[0]})
    res.status(201).send(response)
  })
  .catch(error => {
    res.status(404).send({error: 'Can not add a url to a non-existing folder'})
  })
}

module.exports = {
  folders: folders,
  newFolder: newFolder,
  retrieveFolderUrls: retrieveFolderUrls,
  reRouteLink: reRouteLink,
  increasePopularity: increasePopularity,
  addNewUrl: addNewUrl,
  newFolderName: newFolderName
}
