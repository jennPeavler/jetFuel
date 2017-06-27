const path = require('path')

const homeFile = (req, res) => {
  res.sendFile(path.join(__dirname, '../../assets/html-files/index.html'))
}

const newFolder = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/html-files/new-folder.html'))
}


module.exports = {
  homeFile: homeFile,
  newFolder: newFolder
};
