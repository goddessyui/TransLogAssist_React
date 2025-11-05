const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (isDev) {
    // Load the built files directly for testing
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    // Only open DevTools if explicitly requested via environment variable
    if (process.env.OPEN_DEVTOOLS === 'true') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    // In production, load the built index.html file
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') app.quit();
});

// Place any additional IPC handlers here
ipcMain.handle('ping', () => 'pong');