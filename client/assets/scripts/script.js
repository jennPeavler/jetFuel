let host = window.location.href
let root = host
let shortRoot = ''
if(host.includes('local')) {
  shortRoot = root.substring(7)
} else {
  shortRoot = root.substring(8)
}
// let shortRoot = root.substring(7)
let popularityOrder = true;
let dateOrder = true;

let getFolders = () => {
  return new Promise(function(resolve) {
    fetch(`${root}api/v1/folders`)
    .then(res => res.json())
    .then(response => {
      resolve(response)
    })
  })
}

let main = async () => {
  let folders = await getFolders()

  await Promise.all(folders.map(async (folder) => {
    const test = await fetch(`${root}api/v1/folders/${folder.id}/urls`)
    .then(res => res.json())
    .then(data => {
      let newFolder = {name: folder.name, urls: data}
      printToPage(newFolder)
    })
    .catch(error => {
      let newFolder = {name: folder.name}
      printToPage(newFolder)
    })
  }))
}

window.onload = () => {
  main()
}

const errorHtml = () => {
  let form = document.getElementById('folder-input-popup')
  messageElement = document.createElement('p')
  let message = "Folder created but url was invalid and not inserted into folder."
  messageElement.innerHTML += message
  form.append(messageElement)
  setTimeout(() => {
    messageElement.remove()
  }, 4000)
}

const errorMessage = (error) => {
  if (error == 'bad url') {
    alert('You Submitted a Bad URL')
  } else {
    errorHtml()
  }
}

let recursiveRemove = (arr) => {
  if (arr.length) {
    arr[0].remove()
    recursiveRemove(arr)
  } else {
    return
  }
}

let generateLinks = (urlList, url) => {
  let incrementPopularity = () => {
    fetch(`/api/v1/urls/${url.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
    })
  }

  let urlDiv = document.createElement('div')
  let newLink = document.createElement('li')
  newLink.innerHTML += url.description
  let aTag = document.createElement('a')
  aTag.innerHTML += `${shortRoot}${url.id}`
  aTag.setAttribute('href', `${root}${url.id}`)
  aTag.setAttribute('target', 'blank')
  aTag.addEventListener('click', incrementPopularity)
  newLink.append(aTag)
  urlList.append(newLink)
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
    popularityOrder = !popularityOrder
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

        recursiveRemove(liArray)

        let urlsInOrder = urls.sort((a,b) => {
          if(popularityOrder) {
            return a.popularity - b.popularity
          } else {
            return b.popularity - a.popularity
          }
        })
        urlsInOrder.forEach(url => {
          generateLinks(urlList, url)
        })
      })
    })
  }

  const dateSort = () => {
    dateOrder = !dateOrder
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

        recursiveRemove(liArray)

        let urlsInOrder = urls.sort((a,b) => {
          if(dateOrder) {
            return Date.parse(a.created_at) - Date.parse(b.created_at)
          } else {
            return Date.parse(b.created_at) - Date.parse(a.created_at)
          }
        })

        urlsInOrder.forEach(url => {
          generateLinks(urlList, url)
        })
      })
    })
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
  addUrlButton.innerHTML = 'Submit url'
  newUrlField.append(addUrlInput, addUrlDescription, addUrlButton)
  urlList.append(newUrlField)
  urlList.append(dropNav)
  urlList.style.display = 'none'

  let submitNewUrl = () => {
    addUrlInput.value = addUrlInput.value.includes("http://") ? addUrlInput.value :  addUrlInput.value.includes("www") ? "http://" + addUrlInput.value : "http://" + "www." + addUrlInput.value;

    if(regexTest(addUrlInput.value) && topLevelDomainCheck(addUrlInput.value)) {
      fetch('/api/v1/folders')
      .then(response => response.json())
      .then(res => {
        let match =  res.find(returnedFolder => returnedFolder.name === folder.name )
        return match
      })
      .then(match => {
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
          const { id, description } = data
          generateLinks(urlList, {id, description})
          addUrlInput.value = ''
          addUrlDescription.value = ''
        })
      })
    } else {
      errorMessage('bad url')
      addUrlInput.value = ''
      addUrlDescription.value = ''
    }
  }

  addUrlButton.addEventListener('click', submitNewUrl)
  if(folder.urls) {
    folder.urls.forEach(url => {
      generateLinks(urlList, url)
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

let regexTest = (url) => {
  let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
  return regex.test(url)
}

let topLevelDomainCheck = (url) => {
  if(url.includes('.com') || url.includes('.org') || url.includes('.edu') || url.includes('.gov') || url.includes('.io') || url.includes('.net')) {
    return true
  } else {
    return false
  }
}

const submitFolder = () => {
  let newFolderName = document.getElementById('new-folder-name').value
  let newUrl = document.getElementById('new-url').value
  let newUrlDescription = document.getElementById('new-url-description').value
  newUrl = newUrl.includes("http://") ? newUrl :  newUrl.includes("www") ? "http://" + newUrl : "http://" + "www." + newUrl;

  let urlData = [{url: newUrl, description: newUrlDescription}]

  if (regexTest(newUrl) && topLevelDomainCheck(newUrl)) {
    newFolderPostRequest(newFolderName, urlData)
  } else {
    newFolderNameOnlyPostRequest(newFolderName)
  }
}

let newFolderPostRequest = (newFolderName, urlData) => {
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
    const {name, urls, id} = data
    if (urls) {
      let folderInfo = {name: name, urls: urls}
      printToPage(folderInfo)
    } else {
      let folderInfo = {name: name}
      printToPage(folderInfo)
      errorMessage()
    }
  })
  .catch(error => console.log(error))
}

let newFolderNameOnlyPostRequest = (newFolderName) => {
  fetch(`/api/v1/folders/${newFolderName}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': newFolderName,
    })
  })
  .then(res => res.json())
  .then(data => {
    const {name, id} = data
      let folderInfo = {name: name}
      printToPage(folderInfo)
      errorMessage()
  })
  .catch(error => console.log(error))

  clear()
}

let clear = () => {
  document.getElementById('new-folder-name').value = ''
  document.getElementById('new-url').value = ''
  document.getElementById('new-url-description').value = ''
}

document.getElementById('folder-submit-btn').addEventListener('click', submitFolder)
