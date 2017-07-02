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
    console.log(url);
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
  console.log('adding a new url')
  const { url, description, folder_id } = req.body
  console.log(url);
  database('urls').insert(req.body, 'id')
  .then(data => {
    console.log(data)
    res.status(201).send(data)
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
  addNewUrl: addNewUrl
}
