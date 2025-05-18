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
       //if the user clicked on a spot that was not empty and an error was thrown 
      if (winner == 9 && draw == 9 && computerMove == 9) {
        showErrorMessage();
      } else {
        console.log("winner:", winner, "draw?", draw, "computer move: ", computerMove);
        this.style.backgroundImage = "url(assets/X.png)";
        if (winner != 2 && !draw) {
            markComputerMove(computerMove);
        }
      }
    });
  });
document.querySelectorAll('.Error').forEach(errMessage => {
    errMessage.addEventListener('click', async function() {
        this.style.visibility = "hidden";
    });
});
document.querySelectorAll('.Reset').forEach(resetButton => {
    resetButton.addEventListener('click', async function() {
        const boardState = await ipcRenderer.invoke('reset-game');
        document.querySelectorAll('.Tile').forEach((tile, index) => {
            const content = boardState[index];
            tile.style.backgroundImage = content === 0 ? "url(assets/Tile.png)" : (content === 1 ? "url(assets/O.png)" : "url(assets/X.png)");
        });
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
//showing an error message
function showErrorMessage() {
    console.log("showErrorMessage called");
    let errorElement = document.querySelector(".Error");
    errorElement.style.visibility = "visible";
}
