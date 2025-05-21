//frontend
//tile color: F8DAEC
const{ ipcRenderer } = require ('electron');
let gameInPlay = true;
//will receive messages from main process
ipcRenderer.on('message', (event, message) => {
    console.log(message); //printing message to console
});

document.querySelectorAll('.Tile').forEach(tile => {
    tile.addEventListener('click', async function() {
      const spot = this.getAttribute('data-spot');
      console.log('Clicked spot:', spot);
      //using await bc ipdRenderer itself returns a Promise
      if (gameInPlay) {
        const [winner, draw, computerMove, winType] =  await ipcRenderer.invoke('make-move', spot);
        //if the user clicked on a spot that was not empty and an error was thrown 
        if (winner === 9 && draw === 9 && computerMove === 9) {
            console.log(winner, draw, computerMove, winType);
            showErrorMessage();
        } else {
            console.log("winner:", winner, "draw?", draw, "computer move: ", computerMove);
            this.style.backgroundImage = "url(assets/X.png)";
            if (winner != 2 && !draw) {
                //delaying the computer move by 0.5 secs
                setTimeout(() => {
                    markComputerMove(computerMove);
                }, 500);
            }
            if (winner == 2) {
                //show user winner message
                gameInPlay = false;
                let userWinElement = document.querySelector('.userWin');
                setTimeout(() => {
                    userWinElement.style.visibility = "visible";
                    markWinLine(winType);
                }, 500);
                
            } else if (winner == 1) {
                //show computer winner message
                gameInPlay = false;
                let computerWinElement = document.querySelector('.computerWin');
                setTimeout(() => {
                    computerWinElement.style.visibility = "visible";
                    markWinLine(winType);
                }, 500);
                
            } else if (draw) {
                gameInPlay = false;
                let drawElement = document.querySelector('.draw');
                setTimeout(() => {
                    drawElement.style.visibility = "visible";
                }, 500);
            }
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
        gameInPlay = true;
        
        //hiding both win elements and the line
        let userWinElement = document.querySelector('.userWin');
        userWinElement.style.visibility = "hidden";
        let computerWinElement = document.querySelector('.computerWin');
        computerWinElement.style.visibility = "hidden";
        let winLineElement = document.querySelector(".Line");
        winLineElement.style.visibility = "hidden";
        //resetting win line settings
        winLineElement.style.top = "15%";
        winLineElement.style.left = "0%";
        winLineElement.style.width = "100%";
    });
});
//making a line across the win
function markWinLine(winType) {
    //winType:
    //1,2,3 are the rows top to bottom, 4, 5, 6 are the columns left to right
    //7 is left diagonal, 8 is right diagonal
    let Line = document.querySelector(".Line");
    switch (winType) {
        case 1: //first row
            break; //default position of the line is first row
        case 2: //second row
            Line.style.top = "50%";
            break;
        case 3: //third row
            Line.style.top = "80%";
            break;
        case 4: //first column
            Line.style.transformOrigin = "top left";
            Line.style.transform = "rotate(90deg)";
            Line.style.top = "0%";
            Line.style.left = "17%";
            break;
        case 5: //second column
            Line.style.transformOrigin = "top left";
            Line.style.transform = "rotate(90deg)";
            Line.style.top = "0%";
            Line.style.left = "50%";
            break;
        case 6: //third column
            Line.style.transformOrigin = "top left";
            Line.style.transform = "rotate(90deg)";
            Line.style.top = "0%";
            Line.style.left = "85%";
            break;
        case 7: //left diagonal
            Line.style.transformOrigin = "top left";
            Line.style.transform = "rotate(45deg)";
            Line.style.top = "5%";
            Line.style.left = "5%";
            Line.style.width = "130%";
            break;
        case 8: //right diagonal
            Line.style.transformOrigin = "top left";
            Line.style.transform = "rotate(-45deg)";
            Line.style.top = "95%";
            Line.style.left = "5%";
            Line.style.width = "130%";
            break;
    }
    Line.style.visibility = "visible";  
}
//marking the move that the computer made with an O
function markComputerMove(computerMove) {
    document.querySelectorAll(".Tile").forEach(tile => {
        if (tile.getAttribute('data-spot') == computerMove) {
            tile.style.backgroundImage = "url(assets/O.png)";
        }
    });
}
//showing an error message
function showErrorMessage() {
    console.log("showErrorMessage called");
    let errorElement = document.querySelector(".Error");
    errorElement.style.visibility = "visible";
}
