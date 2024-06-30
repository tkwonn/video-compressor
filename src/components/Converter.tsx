import { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { commonIPC, convertIPC } from '../ipc/ipcRenderer';
import { FileInfo } from '../types';
import { VIDEO_OUTPUT_FORMATS } from '../constants';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Converter = () => {
    const [inputPath, setInputPath] = useState<string>('');
    const [inputFileInfo, setInputFileInfo] = useState<FileInfo | null>(null);
    const [outputFileInfo, setOutputFileInfo] = useState<FileInfo | null>(null);
    const [outputPath, setOutputPath] = useState<string>('');
    const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);
    const [saveOption, setSaveOption] = useState<string>('Download');
    const [loading, setLoading] = useState<boolean>(false);
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [isConverted, setIsConverted] = useState<boolean>(false);
    const [selectedOutputFormat, setSelectedOutputFormat] = useState<string>('mp4');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoControlsVisible, setIsVideoControlsVisible] = useState(false);

    useEffect(() => {
        const updateOutputPath = async () => {
            if (inputPath) {
                try {
                    const newOutputPath = await commonIPC.getSaveLocation(inputPath, saveOption, 'converted', selectedOutputFormat);
                    setOutputPath(newOutputPath);
                } catch (error) {
                    console.error('Error getting save location:', error);
                }
            }
        };
        updateOutputPath();
    }, [saveOption, inputPath, selectedOutputFormat]);

    useEffect(() => {
        const removeVideoPlaybackStartedListener = commonIPC.onVideoPlaybackStarted(() => {
            if (videoRef.current) {
                videoRef.current.play();
                setIsVideoPlaying(true);
                setIsVideoControlsVisible(true);
            }
        });

        return () => {
            removeVideoPlaybackStartedListener();
        };
    }, [videoRef]);


    const selectFile = async () => {
        try {
            const result = await commonIPC.selectFile();
            if (result) {
                setLoading(true);
                setInputPath(result.filePath);
                setInputFileInfo(result.fileInfo);
                setTimeout(() => setLoading(false), 800);
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    };

    const handleSaveOptionChange = (event) => {
        setSaveOption(event.target.value);
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setLoading(true);
            try {
                if (thumbnailPath) {
                    await commonIPC.deleteThumbnail(thumbnailPath);
                }
                const fileInfo = await commonIPC.getFileInfo(file.path);
                setInputPath(file.path);
                setInputFileInfo(fileInfo);
                setThumbnailPath(fileInfo.thumbnail);
            } catch (error) {
                console.error('Error getting file information:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [thumbnailPath]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/avi': ['.avi'],
            'video/quicktime': ['.mov'],
        },
        multiple: false,
        disabled: !!inputPath,
    });

    const convertFile = async () => {
        if (!inputPath || !outputPath) {
            alert('Please select a file and save location.');
            return;
        }
        setIsConverting(true);
        try {
            const convertedInfo = await convertIPC.convertVideo(inputPath, outputPath);
            setIsConverted(true);
            setOutputFileInfo(convertedInfo);
        } catch (error) {
            alert('Conversion failed. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };

    const handlePlayClicked = async () => {
        if (outputFileInfo) {
            try {
                await commonIPC.playVideo(outputPath);
            } catch (error) {
                console.error('Error playing video:', error);
            }
        } else {
            alert('No output file information available.');
        }
    };

    const handleVideoEnded = () => {
        setIsVideoPlaying(false);
        setIsVideoControlsVisible(false);
    };

    return (
        <div className="relative flex flex-col h-full w-full bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Loading Modal */}
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm z-10">
                    <button className="loader__btn">
                        <div className="loader"></div>
                        Loading...
                    </button>
                </div>
            )}

            {/* Top Section */}
            <div className="flex items-center p-3">
                <div className='px-4 py-2 rounded-full hover:bg-gray-100'>
                    <button onClick={selectFile} className="flex items-center text-sm">
                        <NoteAddOutlinedIcon className="w-6 h-6 mr-1" />
                        Add file
                    </button>
                </div>
            </div>

            {/* Drag-n-drop Section */}
            <div {...getRootProps()} className="flex-grow flex justify-center items-center border-y border-gray-200">
                <input {...getInputProps()} id="fileInput" />
                {inputFileInfo ? (
                    <div className="flex flex-col items-center p-4 w-full">
                        <div className="flex items-center mb-4">
                            {inputFileInfo && (
                                <img src={inputFileInfo.thumbnail} alt="Thumbnail" className="rounded w-36 h-24 mr-4" />
                            )}
                            <div>
                                <h3 className="text-md font-semibold">{inputFileInfo.name}</h3>
                                <p className="text-sm">{inputFileInfo.size}</p>
                                <p className='text-xs'>{inputFileInfo.format} • {inputFileInfo.resolution} • {inputFileInfo.duration}</p>
                            </div>
                        </div>
                        {isConverting && (
                            <div className="flex flex-col justify-center items-center w-64 mb-4">
                                <div className="progress__bar">
                                    <div className="progress__element"></div>
                                </div>
                                <p className="text-center text-sm mt-2">Converting...</p>
                            </div>
                        )}
                        <div className="flex justify-center">
                            {isConverted ? (
                                <div className='flex flex-col justify-center items-center'>
                                    <p className="text-center text-sm mb-2">Conversion Complete!</p>
                                    {outputFileInfo && (
                                        <div className="text-xs text-gray-600 mb-4">
                                            <p>Name: {outputFileInfo.name}</p>
                                            <p>Size: {outputFileInfo.size}</p>
                                            <p>Format: {outputFileInfo.format}</p>
                                            <p>Resolution: {outputFileInfo.resolution}</p>
                                            <p>Duration: {outputFileInfo.duration}</p>
                                        </div>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={handlePlayClicked}
                                    >
                                        Play
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={convertFile}
                                    disabled={isConverting}
                                >
                                    Convert
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 rounded">
                        <div className="flex flex-col items-center">
                            <CloudUploadOutlinedIcon style={{ fontSize: '36px' }} className="mb-2" />
                            <p>{isDragActive ? "Drop the video file here" : "Add or drag files here to start conversion."}</p>
                        </div>
                        <hr className="my-6" />
                        <div className="text-sm font-normal flex justify-center items-center">
                            <dl>
                                <div className="flex">
                                    <dt className="w-16">Step 1:</dt>
                                    <dd>Add or drag files here to start conversion.</dd>
                                </div>
                                <div className="flex">
                                    <dt className="w-16">Step 2:</dt>
                                    <dd>Adjust settings if necessary.</dd>
                                </div>
                                <div className="flex">
                                    <dt className="w-16">Step 3:</dt>
                                    <dd>Start converting.</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className="mt-auto px-8 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center mb-4">
                    <div className="mr-8">
                        <label className="text-sm pr-2">Output Format:</label>
                        <select
                            className="border rounded-full px-3 py-1 text-sm"
                            value={selectedOutputFormat}
                            onChange={(e) => setSelectedOutputFormat(e.target.value)}
                            >
                            {VIDEO_OUTPUT_FORMATS.map((format) => (
                                <option key={format.value} value={format.value}>
                                {format.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-end">
                    <div className="flex-grow">
                        <label className="text-sm pr-2">Save Location:</label>
                        <select
                            className="border rounded-full text-sm px-3 py-1"
                            value={saveOption}
                            onChange={handleSaveOptionChange}
                        >
                            <option value="Download">Download</option>
                            <option value="Other">Other...</option>
                        </select>
                    </div>
                </div>
                {outputPath && (
                    <p className="mt-2 text-xs text-gray-600">{outputPath}</p>
                )}
            </div>
            {isVideoPlaying && (
                <div className="w-full h-full flex justify-center items-center">
                    <video
                        ref={videoRef}
                        className="w-full h-full"
                        controls={isVideoControlsVisible}
                        onEnded={handleVideoEnded}
                    />
                </div>
            )}
        </div>
    );
};

export default Converter;
