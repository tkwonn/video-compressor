import { ipcMain } from 'electron';
import { IPCChannels } from '../constants';
import { getFileInformation } from '../utils/ffprobe';
import ffmpeg from '../config/ffmpegConfig';
import { FileInfo } from '../types';
import path from 'path';

export function initConverterIPC() {
    ipcMain.handle(IPCChannels.CONVERT_VIDEO, async (_, { inputPath, outputPath }: { inputPath: string, outputPath: string }) => {
        return new Promise<FileInfo>((resolve, reject) => {
            console.log("hahah", outputPath);

            const command = ffmpeg(inputPath);
            command
                .output(outputPath)
                .on('error', (err, stdout, stderr) => {
                    reject(new Error(`FFmpeg error: ${err.message}\nStdout: ${stdout}\nStderr: ${stderr}`));
                })
                .on('end', async () => {
                    const fileInfo = await getFileInformation(outputPath);
                    resolve(fileInfo);
                })
                .save(outputPath);
        });
    });
}