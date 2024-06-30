import { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { commonIPC, compressorIPC } from '../ipc/ipcRenderer';
import { FileInfo } from '../types';
import { qualityOptions } from '../constants';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';

const Compressor = () => {
    const [inputPath, setInputPath] = useState<string>('');
    const [inputFileInfo, setInputFileInfo] = useState<FileInfo | null>(null);
    const [outputFileInfo, setOutputFileInfo] = useState<FileInfo | null>(null);
    const [outputPath, setOutputPath] = useState<string>('');
    const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);
    const [sizePercentage, setSizePercentage] = useState<number>(70);
    const [quality, setQuality] = useState<string>('High');
    const [saveOption, setSaveOption] = useState<string>('Download');
    const [loading, setLoading] = useState<boolean>(false);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const [isCompressed, setIsCompressed] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoControlsVisible, setIsVideoControlsVisible] = useState(false);


    useEffect(() => {
        const updateOutputPath = async () => {
            if (inputPath) {
                try {
                    const newOutputPath = await commonIPC.getSaveLocation(inputPath, saveOption, 'compressed');
                    setOutputPath(newOutputPath);
                } catch (error) {
                    console.error('Error getting save location:', error);
                }
            }
        };
        updateOutputPath();
    }, [saveOption, inputPath]);

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

    const compressFile = async () => {
        if (!inputPath || !outputPath) {
            alert('Please select a file and save location.');
            return;
        }

        setIsCompressing(true);

        const options = {
            sizePercentage,
            quality,
        };

        try {
            const compressedInfo = await compressorIPC.compressVideo(inputPath, outputPath, options);
            setIsCompressed(true);
            setOutputFileInfo(compressedInfo);
        } catch (error) {
            alert('Compression failed. Please try again.');
        } finally {
            setIsCompressing(false);
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
                        {isCompressing && (
                            <div className="flex flex-col justify-center items-center w-64 mb-4">
                                <div className="progress__bar">
                                    <div className="progress__element"></div>
                                </div>
                                <p className="text-center text-sm mt-2">Compressing...</p>
                            </div>
                        )}
                        <div className="flex justify-center">
                            {isCompressed ? (
                                <div className='flex flex-col justify-center items-center'>
                                    <p className="text-center text-sm mb-2">Compression Complete!</p>
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
                                    onClick={compressFile}
                                    disabled={isCompressing}
                                >
                                    Compress
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 rounded">
                        <div className="flex flex-col items-center">
                            <CloudUploadOutlinedIcon style={{ fontSize: '36px' }} className="mb-2" />
                            <p>{isDragActive ? "Drop the video file here" : "Add or drag files here to start compression."}</p>
                        </div>
                        <hr className="my-6" />
                        <div className="text-sm font-normal flex justify-center items-center">
                            <dl>
                                <div className="flex">
                                    <dt className="w-16">Step 1:</dt>
                                    <dd>Add or drag files here to start compression.</dd>
                                </div>
                                <div className="flex">
                                    <dt className="w-16">Step 2:</dt>
                                    <dd>Adjust settings if necessary.</dd>
                                </div>
                                <div className="flex">
                                    <dt className="w-16">Step 3:</dt>
                                    <dd>Start compressing.</dd>
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
                        <label className="text-sm pr-2">File Size:</label>
                        <select
                            className="border rounded-full px-3 py-1 text-sm"
                            value={sizePercentage}
                            onChange={(e) => setSizePercentage(parseInt(e.target.value))}
                        >
                            {[...Array(7)].map((_, i) => (
                                <option key={i} value={(i + 3) * 10}>
                                    {(i + 3) * 10}%
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className="flex items-center space-x-4 text-sm">
                            {qualityOptions.map((q) => (
                                <label key={q} className="flex items-center">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        name="quality"
                                        value={q}
                                        checked={quality === q}
                                        onChange={(e) => setQuality(e.target.value)}
                                    />
                                    {q} {q === 'High' && '(Recommend)'}
                                </label>
                            ))}
                        </div>
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

export default Compressor;
