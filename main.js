//importing app and Browser window modules
const { app, BrowserWindow, ipcMain } = require('electron') 
const path = require('path');
const {Board} = require('./backend.js');
let gameBoard = new Board();

ipcMain.handle('make-move', (event, spot) => {
    console.log('make move handler called with spot:', spot);
    try {
        gameBoard.makeMove(spot);
        console.log("current board(remember 2 is x 1 is o):\n", gameBoard.stringBoard());
        const winner = gameBoard.checkForWin();
        const isDraw = gameBoard.checkForDraw();
        const computerMove = gameBoard.latestComputerMove;
        return [winner, isDraw, computerMove];
    } catch (Error) {
        return [9, 9, 9];
    }
    
});
ipcMain.handle('reset-game', () => {
    gameBoard.reset();
    board = gameBoard.tiles.map(tile => tile.getContent());
    return board;
});
//creteWindow lods the webpage into a BrowserWindow instance
function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    win.loadFile('index.html')
    //sending message to renderer
    win.webContents.send('message', "Hello from main.js!");
  }
//calls createWindow when ready
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
//exiting the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit() }
  })
