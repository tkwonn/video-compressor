import { app, protocol, net } from 'electron';
import { FileInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from '../config/ffmpegConfig';
import path from 'node:path';
import fs from 'node:fs';

// Custom Protocol: local-resource
export const registerLocalResourceProtocol = () => {
    protocol.handle('local-resource', async (request) => {
        const url = new URL(request.url);
        const filePath = decodeURIComponent(url.pathname);

        try {
            return net.fetch('file://' + filePath);
        } catch (error) {
            return new Response('Not Found', { status: 404 });
        }
    });
}

export const getFileInformation = async (filePath: string): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, async (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const videoStream = metadata.streams.find((stream: any) => stream.codec_type === 'video');
            const majorBrand = metadata.format.tags.major_brand;
            const format = getFileFormat(majorBrand, filePath);
            const duration = formatDuration(metadata.format.duration);
            const thumbnailPath = await generateThumbnail(filePath);

            const fileInfo: FileInfo = {
                name: path.basename(filePath, path.extname(filePath)),
                size: formatSize(metadata.format.size),
                format: format,
                duration: duration,
                resolution: `${videoStream.width}x${videoStream.height}`,
                thumbnail: thumbnailPath,
                bitrate: formatBitRate(metadata.format.bit_rate),
            };
            resolve(fileInfo);
        });
    });
};

const getFileFormat = (majorBrand: string, filePath: string): string => {
    const originalExtension = path.extname(filePath).slice(1);

    switch (majorBrand) {
        case 'mp41':
        case 'mp42':
        case 'avc1':
            return 'MP4';
        case 'mov':
        case 'qt':
            return 'MOV';
        case 'm4a':
            return 'M4A';
        default:
            return originalExtension;
    }
};

const formatSize = (bytes: number): string => {
    // Decimal system is commonly used for file sizes
    const k = 1000;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    let size = bytes / Math.pow(k, i);
    size = Math.round(parseFloat(size.toFixed(1)) * 10) / 10;
    return size.toFixed(1) + ' ' + units[i];
};

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const formatBitRate = (bitRate: number): string => {
    // Convert bit rate to kilobits per second
    return (bitRate / 1000).toFixed(0);
};

const generateThumbnail = async (filePath: string): Promise<string> => {
    const thumbnailDir = app.getPath('temp');
    const thumbnailId = uuidv4();
    const thumbnailName = `thumbnail_${thumbnailId}.png`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailName);

    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .on('end', async () => {
                try {
                    await fs.promises.access(thumbnailPath, fs.constants.F_OK);
                    resolve(`local-resource://${thumbnailPath}`);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .screenshots({
                count: 1,
                folder: thumbnailDir,
                filename: thumbnailName,
            });
    });
};

