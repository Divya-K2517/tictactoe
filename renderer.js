//frontend
const{ ipcRenderer } = require ('electron');
//will receive messages from main process
ipcRenderer.on('message', (event, message) => {
    console.log(message); //printing message to console
});

document.querySelectorAll('.Tile').forEach(tile => {
    tile.addEventListener('click', async function() {
      const spot = this.getAttribute('data-spot');
      console.log('Clicked spot:', spot);
      //using await bc ipdRenderer itself returns a Promise
      const [a, b] =  await ipcRenderer.invoke('make-move', spot);
      //a is winner, and b is whether it is draw or not
      console.log(a, b);
    });
  });
