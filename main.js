//importing app and Browser window modules
const { app, BrowserWindow, ipcMain } = require('electron') 
const path = require('path');
const {Board} = require('./backend.js');
let gameBoard = new Board();
//creteWindow lods the webpage into a BrowserWindow instance
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'renderer.js')
    }
  });
  win.loadFile('index.html')
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
