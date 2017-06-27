const submitFolder = () => {
  const folderName = document.getElementById('folder-name').value
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'name': folderName})
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.log(error))
}

let createFolderButton = document.getElementById('create-folder')
createFolderButton.addEventListener('click', submitFolder)
