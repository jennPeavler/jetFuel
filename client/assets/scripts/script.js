window.onload = () => {
  fetch('http://localhost:3000/api/v1/folders')
  .then(res => res.json())
  .then(response => {
    response.forEach(folder => {
      printToPage(folder)
    })
  })
}

const printToPage = (folder) => {
  const display = document.getElementById('folder-display')
  display.append(folder.name)
}
