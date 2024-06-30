import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';

export const sidebarItems = [
    { name: 'Compressor', icon: MovieFilterOutlinedIcon },
    { name: 'Converter', icon: DriveFileMoveOutlinedIcon },
    { name: 'Video Editor', icon: VideoSettingsIcon },
];

export const qualityOptions = [
    'Low',
    'Standard',
    'High'
]

export enum IPCChannels {
    SELECT_FILE = 'SELECT_FILE',
    GET_SAVE_LOCATION = 'GET_SAVE_LOCATION',
    GET_FILE_INFO = 'GET_FILE_INFORMATION',
    DELETE_THUMBNAIL = 'DELETE_THUMBNAIL',
    PLAY_VIDEO = 'PLAY_VIDEO',
    PLAY_VIDEO_STARTED = 'PLAY_VIDEO_STARTED',
    COMPRESS_VIDEO = 'COMPRESS_VIDEO',
    COMPRESS_PROGRESS = 'COMPRESS_PROGRESS',
    COMPRESS_COMPLETE = 'COMPRESS_COMPLETE',
    COMPRESS_ERROR = 'COMPRESS_ERROR',
    CONVERT_VIDEO = 'CONVERT_VIDEO',
}

export const VIDEO_OUTPUT_FORMATS = [
    { value: 'mp4', label: 'MP4' },
    { value: 'mov', label: 'MOV' },
    { value: 'webm', label: 'WEBM' },
    { value: 'avi', label: 'AVI' },
];