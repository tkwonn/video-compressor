const { contextBridge, ipcRenderer } = require('electron');
const { IPCChannels } = require('./constants');

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
    playVideo: (filePath) => ipcRenderer.invoke(IPCChannels.PLAY_VIDEO, filePath),
    onVideoPlaybackStarted: (callback) => {
        const wrappedCallback = () => {
            callback();
        };
        ipcRenderer.on(IPCChannels.PLAY_VIDEO_STARTED, wrappedCallback);
        return () => {
            ipcRenderer.removeListener(IPCChannels.PLAY_VIDEO_STARTED, wrappedCallback);
        };
    },
});
