import { ipcMain } from 'electron';
import { IPCChannels } from '../constants';
import { getFileInformation } from '../utils/ffprobe';
import { getCRFValue, getPresetValue, timemarkToSeconds } from '../utils/ffmpeg';
import ffmpeg from '../config/ffmpegConfig';

export function initCompressorIPC() {
    ipcMain.handle(IPCChannels.COMPRESS_VIDEO, async (_, { inputPath, outputPath, options }: { inputPath: string; outputPath: string; options: { sizePercentage: number, quality: string } }) => {
        return new Promise((resolve, reject) => {
            let totalTime: number = 0;
            let lastProgress: number = 0;
            let currentProgress: number | null = null;

            const command = ffmpeg(inputPath);
            command
                .outputOptions([
                    `-filter:v scale=iw*${options.sizePercentage/100}:ih*${options.sizePercentage/100}`,
                    `-crf ${getCRFValue(options.quality)}`,
                    `-preset ${getPresetValue(options.quality)}`,
                ])
                .on('codecData', (data) => {
                    totalTime = timemarkToSeconds(data.duration);
                })
                .on('progress', (progress) => {
                    const currentTime = timemarkToSeconds(progress.timemark);
                    currentProgress = Math.floor((currentTime / totalTime) * 100);
                    if (currentProgress - lastProgress >= 1) {
                        lastProgress = currentProgress;
                    }
                })
                .on('error', (err, stdout, stderr) => {
                    reject(new Error(`FFmpeg error: ${err.message}\nStdout: ${stdout}\nStderr: ${stderr}`));
                })
                .on('end', async () => {
                    const compressedInfo = await getFileInformation(outputPath);
                    resolve(compressedInfo);
                })
                .save(outputPath);
        });
    });
}

