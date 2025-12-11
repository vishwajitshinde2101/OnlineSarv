import React, { useState, useRef, useEffect } from 'react';
import removeBackground from '@imgly/background-removal';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import { formatBytes } from '../utils/formatBytes';

const BackgroundRemover: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalSrc, setOriginalSrc] = useState<string | null>(null);
    const [resultSrc, setResultSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Clean up object URLs when component unmounts or resultSrc changes
    useEffect(() => {
        return () => {
            if (resultSrc) {
                URL.revokeObjectURL(resultSrc);
            }
        };
    }, [resultSrc]);

    const handleFileChange = async (file: File) => {
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please select a JPG, PNG, or WEBP image.');
            return;
        }

        setError(null);
        if (resultSrc) {
            URL.revokeObjectURL(resultSrc);
        }
        setResultSrc(null);
        setImageFile(file);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => setOriginalSrc(e.target?.result as string);
        reader.readAsDataURL(file);

        try {
            setLoadingMessage('Processing image...');
            const resultBlob = await removeBackground(file, {
                progress: (key, current, total) => {
                    const progress = (current / total) * 100;
                    if (key.startsWith('fetch')) {
                        setLoadingMessage(`Downloading model (${Math.round(progress)}%)...`);
                    } else {
                        setLoadingMessage(`Removing background...`);
                    }
                },
                output: {
                    format: 'image/png'
                }
            });
            const objectUrl = URL.createObjectURL(resultBlob);
            setResultSrc(objectUrl);
        } catch (e: any) {
            setError(`An error occurred during processing: ${e.message}`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileChange(e.target.files[0]);
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleReset = () => {
        setImageFile(null);
        setOriginalSrc(null);
        if (resultSrc) {
            URL.revokeObjectURL(resultSrc);
        }
        setResultSrc(null);
        setError(null);
        setIsLoading(false);
        setLoadingMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const getDownloadFilename = () => {
        if (!imageFile) return 'background-removed.png';
        const name = imageFile.name.replace(/\.[^/.]+$/, "");
        return `${name}-bg-removed.png`;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            {!imageFile ? (
                <div 
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                >
                    <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag & drop</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileInputChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                    />
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Original Image */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Original</h3>
                            <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner flex items-center justify-center p-2">
                                <img src={originalSrc!} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{formatBytes(imageFile.size)}</p>
                        </div>
                        
                        {/* Result Image */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Result</h3>
                            <div className="w-full h-96 checkered-bg rounded-lg shadow-inner flex items-center justify-center p-2">
                                {isLoading ? (
                                    <div className="text-center">
                                        <SpinnerIcon className="w-12 h-12 text-brand-primary mx-auto" />
                                        <p className="mt-4 text-gray-600 dark:text-gray-300">{loadingMessage}</p>
                                    </div>
                                ) : resultSrc ? (
                                    <img src={resultSrc} alt="Background removed" className="max-w-full max-h-full object-contain" />
                                ) : (
                                     <p className="text-gray-500 dark:text-gray-400">Processing failed or was cancelled.</p>
                                )}
                            </div>
                             {resultSrc && !isLoading && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Result will be a PNG file</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={resultSrc!}
                            download={getDownloadFilename()}
                            className={`w-full sm:w-auto inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${!resultSrc || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={(e) => (!resultSrc || isLoading) && e.preventDefault()}
                        >
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Download Result
                        </a>
                        <button
                            onClick={handleReset}
                            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                        >
                            Remove Another Image
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
        </div>
    );
};

export default BackgroundRemover;