import { dialog, app, ipcMain } from 'electron';
import { IPCChannels } from '../constants';
import { getFileInformation } from '../utils/ffprobe';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';

export function initCommonIPC() {
    ipcMain.handle(IPCChannels.SELECT_FILE, async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Videos', extensions: ['mp4', 'avi', 'mov'] }]
        });

        if (result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const fileInfo = await getFileInformation(filePath);
            return { filePath, fileInfo };
        }
        return null;
    });

    ipcMain.handle(IPCChannels.GET_SAVE_LOCATION, async (_, { inputPath, option, feat, format }: { inputPath: string, option: string, feat: string, format?: string }) => {
        let outputPath: string;
        const ext = format ? `.${format}` : path.extname(inputPath);
        const getDefaultPath = () => path.join(app.getPath('downloads'), `${feat}_${path.basename(inputPath, path.extname(inputPath))}${ext}`);

        switch (option) {
            case 'Download':
                outputPath = getDefaultPath();
                break;
            case 'Other':
                const result = await dialog.showOpenDialog({
                    properties: ['openDirectory']
                });
                if (result.canceled || result.filePaths.length === 0) {
                    outputPath = getDefaultPath();
                } else {
                    outputPath = path.join(result.filePaths[0], `${feat}_${path.basename(inputPath, path.extname(inputPath))}${ext}`);
                }
                break;
            default:
                outputPath = getDefaultPath();
        }

        return outputPath;
    });

    ipcMain.handle(IPCChannels.GET_FILE_INFO, async (_, filePath: string) => {
        return await getFileInformation(filePath);
    });

    ipcMain.handle(IPCChannels.DELETE_THUMBNAIL, async (_, thumbnailUrl: string) => {
        try {
            const filePath = thumbnailUrl.replace('local-resource://', '');
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting thumbnail:', error);
        }
    });

    ipcMain.handle(IPCChannels.PLAY_VIDEO, async (event, filePath: string) => {
        return new Promise((resolve, reject) => {
            const ffplayProcess = spawn('ffplay', [filePath], { windowsHide: true });

            ffplayProcess.on('error', (err) => {
                reject(err);
            });

            ffplayProcess.on('close', (code) => {
                resolve(code);
            });

            event.sender.send(IPCChannels.PLAY_VIDEO_STARTED);
        });
    });
}