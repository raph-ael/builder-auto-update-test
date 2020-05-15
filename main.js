const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow;

autoUpdater.logger = log;
//autoUpdater.logger.transports.file.level = 'info';


function createWindow () {

  logger.info('create window');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {

    setTimeout(() => {

      console.log('check for updates');
      autoUpdater.checkForUpdatesAndNotify();

    }, 5000);
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app-version', (event) => {
  event.sender.send('app-version', { version: app.getVersion() });
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});
