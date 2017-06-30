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
        console.log('loaded data', newFolder)
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
  let popularityButton = document.createElement('button')
  let newestButton = document.createElement('button')
  urlList.append(popularityButton)
  urlList.append(newestButton)
  urlList.style.display = 'none'

  newFolder.classList.add('folders')
  let folderTitle = document.createElement('p')
  folderTitle.classList.add('folder-names')
  folderTitle.innerHTML += `${folder.name}`
  newFolder.append(folderTitle)


  folder.urls.forEach(url => {
    let incrementPopularity = () => {
      fetch(`/api/v1/urls/${url.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
      })
    }
    let newLink = document.createElement('li')
    let aTag = document.createElement('a')
    aTag.innerHTML += `localhost:3000/${url.id}`
    aTag.setAttribute('href', `http://localhost:3000/${url.id}`)
    aTag.setAttribute('target', 'blank')
    aTag.addEventListener('click', incrementPopularity)
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
  display.prepend(newFolder)
}

// const createFolder = () => {
//   const makeFolderPopup = document.getElementById('folder-input-popup')
//   makeFolderPopup.style.display = 'flex'
// }

const submitFolder = () => {
  const newFolderName = document.getElementById('new-folder-name').value
  const newUrl = document.getElementById('new-url').value
  const newUrlDescription = document.getElementById('new-url-description').value
  const newUrl2 = document.getElementById('new-url2').value
  const newUrlDescription2 = document.getElementById('new-url-description2').value

  const urlData = [{url: newUrl, description: newUrlDescription}, {url: newUrl2, description: newUrlDescription2}]

  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': newFolderName,
      'urls': urlData
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('submitted folder data', data);
    const {name, urls, id} = data
    let folderInfo = {name: name, urls: urls}
    printToPage(folderInfo)
  })
  .catch(error => console.log(error))

}

// let createFolderButton = document.getElementById('create-folder-btn')
// createFolderButton.addEventListener('click', createFolder)


let folderSubmitButton = document.getElementById('folder-submit-btn')
folderSubmitButton.addEventListener('click', submitFolder)
