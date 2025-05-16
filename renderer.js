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
      const [winner, draw, computerMove] =  await ipcRenderer.invoke('make-move', spot);
      //a is winner, and b is whether it is draw or not
      console.log("winner:", winner, "draw?", draw, "computer move: ", computerMove);
      const contentElement = this.querySelector('.content'); //fine bc theres only one content class in each tile anyway
      if (winner == null && !draw) {
        this.style.backgroundImage = "url(assets/X.png)";
        
        markComputerMove(computerMove);
      }
    });
  });
//marking the move that the computer made with an O
function markComputerMove(computerMove) {
    document.querySelectorAll(".Tile").forEach(tile => {
        if (tile.getAttribute('data-spot') == computerMove) {
            tile.style.backgroundImage = "url(assets/O.jpeg)";
        }
    });
}
