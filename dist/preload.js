"use strict";
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    // Provide one method per IPC message
    notify: (message) => ipcRenderer.send('notify', message)
});
