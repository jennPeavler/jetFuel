let folderArr = []

window.onload = () => {
  fetch('http://localhost:3000/api/v1/folders')
  .then(res => res.json())
  .then(response => {
    response.forEach(folder => {
      if(folder.name) {
        folderArr.push(folder)
      }
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
    console.log(folder)
  }

  newFolder.addEventListener('click', clickFolder)
  display.append(newFolder)
}


const createFolder = () => {
  const makeFolderPopup = document.getElementById('folder-input-popup')
  makeFolderPopup.style.display = 'flex'

}

const submitFolder = () => {
  const newFolderName = document.getElementById('new-folder-name').value
  const newUrl = document.getElementById('new-url').value
  const newUrlDescription = document.getElementById('new-url-description').value

  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': newFolderName,
      'url': newUrl,
      'description': newUrlDescription
    })
  })
  .then(res => res.json())
  .then(data => {
    printToPage(data)
  })
  .catch(error => console.log(error))

  const makeFolderPopup = document.getElementById('folder-input-popup')
  makeFolderPopup.style.display = 'none'
}

let createFolderButton = document.getElementById('create-folder-btn')
createFolderButton.addEventListener('click', createFolder)


let folderSubmitButton = document.getElementById('folder-submit-btn')
folderSubmitButton.addEventListener('click', submitFolder)



// const folderName = document.getElementById('folder-name').value


//
// let createFolderButton = document.getElementById('create-folder')
// createFolderButton.addEventListener('click', submitFolder)
