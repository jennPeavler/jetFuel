window.onload = () => {
  fetch('http://localhost:3000/api/v1/folders')
  .then(res => res.json())
  .then(response => {
    folderArr = []
    response.forEach(folder => {
      folderArr.push(folder)
    })
    alphabetize(folderArr).forEach(folder => printToPage(folder))
  })
}

const alphabetize = (folderArr) => {
  return folderArr.sort((a,z) => a.name.toUpperCase() < z.name.toUpperCase() ? -1 : 1)
}

const printToPage = (folder) => {
  const display = document.getElementById('folder-display')
  let newFolder = document.createElement('div')

  newFolder.classList.add('folders')
  newFolder.append(folder.name)

  let clickFolder = () => {
    console.log(folder.name)
  }

  newFolder.addEventListener('click', clickFolder)
  display.append(newFolder)
}



// const submitFolder = () => {
//   const folderName = document.getElementById('folder-name').value
//   fetch('/api/v1/folders', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({'name': folderName})
//   })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(error => console.log(error))
// }
//
// let createFolderButton = document.getElementById('create-folder')
// createFolderButton.addEventListener('click', submitFolder)
