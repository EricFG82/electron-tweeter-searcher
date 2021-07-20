/**
 * Entry point of the Election app.
 */
import * as path from 'path';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain } from 'electron';
import { TwitterService } from './services/twitter.service';
import { StorageService } from './services/storage.service';

const isProd = process.env.NODE_ENV === 'production';
let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    /**
     * Easy way to import Electron in React Typescript renderer page:
     * It gives access to Electron node modules on your renderer process. 
     * For security reasons, it's not recommended by Electron.
     * Using that way, you can import directly any Electron modules on the Typescript 
     * renderer page. For instance: import { ipcRenderer } from 'electron';
     */
    // webPreferences: {
    //   webSecurity: false,
    //   devTools: !isProd,
    //   nodeIntegration: true
    // }
    /**
     * The right way to import Electron in React Typescript renderer page:
     * It gives access only to the exposed methods defined in the contextBridge 
     * defined on "the electron.preload.js" file. This will avoid security problems. 
     */
    webPreferences: {
      devTools: !isProd,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "electron.preload.js") // use a preload script
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  ).finally(() => { /* no action */ });

  if (!isProd) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Global service of the main app
const storageService: StorageService = new StorageService();
const twitterService: TwitterService = new TwitterService(storageService);

// Handle to search and return tweets in the main process
ipcMain.handle('searchTweets', async (event: any, queryData: any) => {
  return await twitterService.searchTweets(queryData.query, queryData.count);
});

// Handle to return the stored value in the main process
ipcMain.handle('getStoredValue', (event: any, key: string) => {
	return storageService.get(key);
});

// Handle to save a value on the storage in the main process
ipcMain.handle('setStoredValue', (event, storageData) => {
	storageService.set(storageData.key, storageData.value);
});

// Handle to remove a stored value in the main process
ipcMain.handle('removeStoredValue', (event: any, key: string) => {
	storageService.remove(key);
});
