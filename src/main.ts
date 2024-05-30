import { BrowserWindow, app, screen, Notification, ipcMain } from 'electron';
import path from 'node:path';

const isDev = !app.isPackaged;

// 開発時には electron アプリをホットリロードする
if (isDev) {
    require("electron-reload")(__dirname, {
        electron: path.resolve(
            __dirname,
            process.platform === "win32"
            ? "../node_modules/electron/dist/electron.exe"
            : "../node_modules/.bin/electron",
        ),
        forceHardReset: true,
        hardResetMethod: "exit",
    });
}

function createWindow () {
    // すべてのディスプレイ情報を取得
    const displays = screen.getAllDisplays()

    // 2つ目のディスプレイが存在する場合、その情報を取得
    const externalDisplay = displays.find((display: any) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    if (externalDisplay) {
        let win;
        win = new BrowserWindow({
            x: externalDisplay.bounds.x + 50,
            y: externalDisplay.bounds.y + 50,
            width: 1100,
            height: 700,
            // titleBarStyle: 'hidden',
            webPreferences: {
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
            }
        })
        // Windowに表示する内容をロード
        win.loadFile('dist/index.html')
        // 開発時には、開発者ツールを表示
        // isDev && win.webContents.openDevTools()
    }
}

ipcMain.on('notify', (_, message) => {
    console.log('notify event received', message)
    new Notification({ title: 'Notification', body: message }).show()
});


app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    
    // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    // const mainWindow = new BrowserWindow({
    //     webPreferences: {
    //         // tsc or webpack が出力したプリロードスクリプトを読み込み
    //         preload: path.join(__dirname, 'preload.js'),
    //     },
    // });

    // レンダラープロセスをロード
    // mainWindow.loadFile('dist/index.html');
});


// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());