let folderArr = []

window.onload = () => {
  function getFolders() {
    return new Promise(function(resolve) {
      fetch('http://localhost:3000/api/v1/folders')
      .then(res => res.json())
      .then(response => {
        resolve(response)
      })
    })
  }

  async function main() {
    let folders = await getFolders()

    await Promise.all(folders.map(async (folder) => {
      const test = await fetch(`http://localhost:3000/api/v1/folders/${folder.id}/urls`)
      .then(res => res.json())
      .then(data => {
        let newFolder = {name: folder.name, urls: data}
        printToPage(newFolder)
        folderArr.push(newFolder)
      })
    }))
  }

  main()

}

const printToPage = (folder) => {
  const display = document.getElementById('folder-display')
  let newFolder = document.createElement('div')
  let urlList = document.createElement('ul')
  urlList.style.display = 'none'

  newFolder.classList.add('folders')
  let folderTitle = document.createElement('p')
  folderTitle.classList.add('folder-names')
  folderTitle.innerHTML += `${folder.name}`
  newFolder.append(folderTitle)
  folder.urls.forEach(url => {
    let newLink = document.createElement('li')
    let aTag = document.createElement('a')
    aTag.innerHTML += `localhost:3000/${url.id}`
    aTag.setAttribute('href', `http://www.${url.url}`)
    aTag.setAttribute('target', 'blank')
    newLink.append(aTag)
    urlList.append(newLink)
  })
  newFolder.append(urlList)

  let clickFolder = () => {
    if(urlList.style.display === 'none') {
      urlList.style.display = 'block'
    } else {
      urlList.style.display = 'none'
    }
  }

  folderTitle.addEventListener('click', clickFolder)
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
    console.log(data);
    const {name, url, description, id} = data
    let test = {name: name, urls: [{url: url, id: id}], description: description}
    printToPage(test)
  })
  .catch(error => console.log(error))

  const makeFolderPopup = document.getElementById('folder-input-popup')
  makeFolderPopup.style.display = 'none'
}

let createFolderButton = document.getElementById('create-folder-btn')
createFolderButton.addEventListener('click', createFolder)


let folderSubmitButton = document.getElementById('folder-submit-btn')
folderSubmitButton.addEventListener('click', submitFolder)
