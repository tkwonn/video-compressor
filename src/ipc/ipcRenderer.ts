import { IPCChannels } from '../constants';
import { FileInfo } from '../types';

const ipcRenderer = (window as any).electronAPI;

async function invokeIPC<T>(channel: IPCChannels, ...args: any[]): Promise<T> {
    try {
        return await ipcRenderer.invoke(channel, ...args) as T;
    } catch (error) {
        console.error(`Error in channel ${channel}:`, error);
        throw error;
    }
}

export const commonIPC = {
    selectFile: () => invokeIPC<{ filePath: string; fileInfo: FileInfo } | null>(IPCChannels.SELECT_FILE),
    getSaveLocation: (inputPath: string, option: string, feat: string, format?: string) => invokeIPC<string>(IPCChannels.GET_SAVE_LOCATION, { inputPath, option, feat, format }),
    getFileInfo: (filePath: string) => invokeIPC<FileInfo>(IPCChannels.GET_FILE_INFO, filePath),
    deleteThumbnail: (thumbnailPath: string) => invokeIPC<void>(IPCChannels.DELETE_THUMBNAIL, thumbnailPath),
    playVideo: (filePath: string) => invokeIPC<void>(IPCChannels.PLAY_VIDEO, filePath),
    onVideoPlaybackStarted: (callback: () => void) => {
        ipcRenderer.on(IPCChannels.PLAY_VIDEO_STARTED, callback);
        return () => {
            ipcRenderer.removeListener(IPCChannels.PLAY_VIDEO_STARTED, callback);
        };
    },
}

export const compressorIPC = {
    compressVideo: (inputPath: string, outputPath: string, options: { sizePercentage: number, quality: string }) => invokeIPC<FileInfo>(IPCChannels.COMPRESS_VIDEO, { inputPath, outputPath, options }),
};

export const convertIPC = {
    convertVideo: (inputPath: string, outputPath: string) => invokeIPC<FileInfo>(IPCChannels.CONVERT_VIDEO, { inputPath, outputPath }),
};
