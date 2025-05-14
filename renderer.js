//frontend
const { ipcRenderer } = require('electron');
document.getElementById('fetchBtn').onclick = async () => {
  const message = await ipcRenderer.invoke('get-message');
  document.getElementById('output').innerText = message;
};

document.querySelectorAll('.Tile').forEach(tile => {
    tile.addEventListener('click', function() {
      const spot = this.getAttribute('data-spot');
      console.log('Clicked spot:', spot);
      // Here you can send the spot to the main process if needed:
      ipcRenderer.invoke('make-move', spot);
    });
  });