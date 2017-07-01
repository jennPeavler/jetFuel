let folderArr = []
let host = window.location.href
let root = host

window.onload = () => {
  function getFolders() {
    return new Promise(function(resolve) {
      fetch(`${root}api/v1/folders`)
      .then(res => res.json())
      .then(response => {
        resolve(response)
      })
    })
  }

  async function main() {
    let folders = await getFolders()

    await Promise.all(folders.map(async (folder) => {
      const test = await fetch(`${root}api/v1/folders/${folder.id}/urls`)
      .then(res => res.json())
      .then(data => {
          let newFolder = {name: folder.name, urls: data}
          printToPage(newFolder)
          folderArr.push(newFolder)

      })
      .catch(error => {
        let newFolder = {name: folder.name}
        printToPage(newFolder)
      })
    }))
  }

  main()

}

const printToPage = (folder) => {
  const display = document.getElementById('folder-display')
  let newFolder = document.createElement('div')
  newFolder.classList.add('folders')

  let folderTitle = document.createElement('p')
  folderTitle.classList.add('folder-names')
  folderTitle.innerHTML += `${folder.name}`
  newFolder.append(folderTitle)

  const popularitySort = () => {
    fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => {
      let match = folders.find(returnedFolder => returnedFolder.name === folder.name)
      return match
    })
    .then(match => {
      fetch(`${root}api/v1/folders/${match.id}/urls`)
      .then(res => res.json())
      .then(urls => {
        let liArray = newFolder.getElementsByTagName("li")
        let recursiveRemove = (arr) => {
          if (arr.length) {
            liArray[0].remove()
            recursiveRemove(arr)
          } else {
            return
          }
        }
        recursiveRemove(liArray)

        let urlsInOrder = urls.sort((a,b) => {
          return b.popularity - a.popularity
        })

        urlsInOrder.forEach(url => {

          let incrementPopularity = () => {
            fetch(`/api/v1/urls/${url.id}`, {
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
            })
          }
          let urlDiv = document.createElement('div')
          let newLink = document.createElement('li')
          let aTag = document.createElement('a')
          aTag.innerHTML += `${root}${url.id}`
          aTag.setAttribute('href', `${root}${url.id}`)
          aTag.setAttribute('target', 'blank')
          aTag.addEventListener('click', incrementPopularity)
          newLink.append(aTag)
          urlList.append(newLink)

        })

      })
    })
  }

  const dateSort = () => {
    console.log('date sort');
  }

  let urlList = document.createElement('ul')
  let dropNav = document.createElement('div')
  dropNav.setAttribute('id', 'drop-nav')
  let popularityButton = document.createElement('button')
  let dateButton = document.createElement('button')
  dateButton.innerHTML = 'date'
  popularityButton.innerHTML = 'popularity'
  popularityButton.classList.add('sort-btn')
  dateButton.classList.add('sort-btn')
  dropNav.append(popularityButton, dateButton)
  popularityButton.addEventListener('click', popularitySort)
  dateButton.addEventListener('click', dateSort)

  let newUrlField = document.createElement('div')
  let addUrlInput = document.createElement('input')
  addUrlInput.setAttribute('type', 'text')
  let addUrlDescription = document.createElement('input')
  addUrlInput.classList.add('new-url-input')
  addUrlInput.setAttribute('placeholder', 'Enter url')
  addUrlInput.setAttribute('id', 'add-url-input')
  addUrlDescription.classList.add('new-url-input')
  addUrlDescription.setAttribute('placeholder', 'Enter url description')
  addUrlDescription.setAttribute('id', 'url-description-input')
  let addUrlButton = document.createElement('button')
  addUrlButton.setAttribute('id', 'add-url-btn')
  addUrlButton.innerHTML = 'Sumbit url'
  newUrlField.append(addUrlInput, addUrlDescription, addUrlButton)
  urlList.append(newUrlField)
  urlList.append(dropNav)
  urlList.style.display = 'none'

  let submitNewUrl = () => {

    fetch('/api/v1/folders')
    .then(response => response.json())
    .then(res => {
      let match =  res.find(returnedFolder => returnedFolder.name === folder.name )
      return match
    })
    .then(match => {
      console.log(match)
      fetch('/api/v1/urls', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'url': addUrlInput.value,
          'description': addUrlDescription.value,
          'folder_id': match.id
        })
      })
      .then(res => res.json())
      .then(data => {
        let incrementPopularity = () => {
          fetch(`/api/v1/urls/${data[0]}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
          })
        }
        let urlDiv = document.createElement('div')
        let newLink = document.createElement('li')
        let aTag = document.createElement('a')
        aTag.innerHTML += `${root}/${data[0]}`
        aTag.setAttribute('href', `${root}/${data[0]}`)
        aTag.setAttribute('target', 'blank')
        aTag.addEventListener('click', incrementPopularity)
        newLink.append(aTag)
        urlList.append(newLink)
      })

      })
  }

  addUrlButton.addEventListener('click', submitNewUrl)
  if(folder.urls) {
    folder.urls.forEach(url => {
      let incrementPopularity = () => {
        fetch(`/api/v1/urls/${url.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
        })
      }
      let newLink = document.createElement('li')
      let aTag = document.createElement('a')
      aTag.innerHTML += `${root}${url.id}`
      aTag.setAttribute('href', `${root}${url.id}`)
      aTag.setAttribute('target', 'blank')
      aTag.addEventListener('click', incrementPopularity)
      newLink.append(aTag)
      urlList.append(newLink)
    })
  }
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

const submitFolder = () => {
  const newFolderName = document.getElementById('new-folder-name').value
  const newUrl = document.getElementById('new-url').value
  const newUrlDescription = document.getElementById('new-url-description').value

  const urlData = [{url: newUrl, description: newUrlDescription}]

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
    if (urls) {
      let folderInfo = {name: name, urls: urls}
      printToPage(folderInfo)
    } else {
      let folderInfo = {name: name}
      printToPage(folderInfo)
    }
  })
  .catch(error => console.log(error))

}

let folderSubmitButton = document.getElementById('folder-submit-btn')
folderSubmitButton.addEventListener('click', submitFolder)
