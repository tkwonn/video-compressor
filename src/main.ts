import { BrowserWindow, app, screen } from 'electron';
import { initializeIPC } from './ipc/ipcMain';
import { registerLocalResourceProtocol } from './utils/ffprobe';
import path from 'node:path';

const isDev = !app.isPackaged;

if (isDev) {
    require("electron-reload")(__dirname, {
        electron: path.resolve(
            __dirname,
            process.platform === "win32"
            ? "../node_modules/electron/dist/electron.exe"
            : "../node_modules/.bin/electron",
        ),
        // forceHardReset: true,
        hardResetMethod: "exit",
    });
}

app.whenReady().then(() => {
    initializeIPC();
    registerLocalResourceProtocol();
    
    let mainWindow;
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 700,
        titleBarStyle: 'default',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // Content Security Policy for Custom Protocol
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self';" +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval';" +
                    "style-src 'self' 'unsafe-inline';" +
                    "img-src 'self' data: local-resource:;" +
                    "font-src 'self' data:;"
                ]
                }
            });
    });

    mainWindow.loadFile('dist/index.html');
});

// Quit when all windows are closed
app.once('window-all-closed', () => app.quit());