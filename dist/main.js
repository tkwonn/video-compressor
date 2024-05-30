"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const isDev = !electron_1.app.isPackaged;
// 開発時には electron アプリをホットリロードする
if (isDev) {
    require("electron-reload")(__dirname, {
        electron: node_path_1.default.resolve(__dirname, process.platform === "win32"
            ? "../node_modules/electron/dist/electron.exe"
            : "../node_modules/.bin/electron"),
        forceHardReset: true,
        hardResetMethod: "exit",
    });
}
function createWindow() {
    // すべてのディスプレイ情報を取得
    const displays = electron_1.screen.getAllDisplays();
    // 2つ目のディスプレイが存在する場合、その情報を取得
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });
    if (externalDisplay) {
        let win;
        win = new electron_1.BrowserWindow({
            x: externalDisplay.bounds.x + 50,
            y: externalDisplay.bounds.y + 50,
            width: 1100,
            height: 700,
            // titleBarStyle: 'hidden',
            webPreferences: {
                contextIsolation: true,
                preload: node_path_1.default.join(__dirname, 'preload.js'),
            }
        });
        // Windowに表示する内容をロード
        win.loadFile('dist/index.html');
        // 開発時には、開発者ツールを表示
        // isDev && win.webContents.openDevTools()
    }
}
electron_1.ipcMain.on('notify', (_, message) => {
    console.log('notify event received', message);
    new electron_1.Notification({ title: 'Notification', body: message }).show();
});
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
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
electron_1.app.once('window-all-closed', () => electron_1.app.quit());
