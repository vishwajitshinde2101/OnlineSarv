import React, { useState, useRef } from 'react';
import { formatBytes } from '../utils/formatBytes';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

type TargetFormat = 'jpeg' | 'png' | 'webp';

const ImageConverter: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<TargetFormat>('jpeg');
    
    const [convertedImageSrc, setConvertedImageSrc] = useState<string | null>(null);
    const [convertedSize, setConvertedSize] = useState<number | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please select a JPG, PNG, WEBP, GIF, or BMP image.');
            return;
        }

        setError(null);
        setConvertedImageSrc(null);
        setConvertedSize(null);
        setOriginalFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setOriginalImageSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
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

    const handleConvert = () => {
        if (!originalImageSrc) return;

        setIsLoading(true);
        setError(null);
        setConvertedImageSrc(null);
        setConvertedSize(null);

        const image = new Image();
        image.src = originalImageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                setError('Could not get canvas context.');
                setIsLoading(false);
                return;
            }

            // Fill background for formats that don't support transparency (like JPEG)
            if (targetFormat === 'jpeg') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(image, 0, 0);
            
            const mimeType = `image/${targetFormat}`;
            const convertedDataUrl = canvas.toDataURL(mimeType);
            setConvertedImageSrc(convertedDataUrl);

            fetch(convertedDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    setConvertedSize(blob.size);
                    setIsLoading(false);
                });
        };
        image.onerror = () => {
            setError('Could not load image to convert.');
            setIsLoading(false);
        };
    };

    const handleReset = () => {
        setOriginalFile(null);
        setOriginalImageSrc(null);
        setConvertedImageSrc(null);
        setConvertedSize(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getDownloadFilename = () => {
        if (!originalFile) return `converted-image.${targetFormat}`;
        const name = originalFile.name.replace(/\.[^/.]+$/, "");
        return `${name}.${targetFormat}`;
    };

    return (
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
        {!originalFile ? (
            <div 
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag & drop</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP, GIF, BMP</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
                    className="hidden"
                />
            </div>
        ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Original Image</h3>
                  <img src={originalImageSrc!} alt="Original" className="max-w-full h-auto max-h-80 rounded-lg shadow-md mx-auto" />
                  <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                      Size: {formatBytes(originalFile.size)}
                  </p>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                    <div>
                        <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Convert to:
                        </label>
                        <select
                            id="format"
                            value={targetFormat}
                            onChange={(e) => setTargetFormat(e.target.value as TargetFormat)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white"
                        >
                            <option value="jpeg">JPG</option>
                            <option value="png">PNG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>
                    <button
                        onClick={handleConvert}
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><SpinnerIcon className="w-5 h-5 mr-2" /> Converting...</>
                        ) : 'Convert Image'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Convert Another Image
                    </button>
                </div>
              </div>
              
              {convertedImageSrc && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Converted Image</h3>
                  <img src={convertedImageSrc} alt="Converted" className="max-w-full h-auto max-h-80 rounded-lg shadow-md mx-auto" />
                  {convertedSize !== null && (
                    <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                      New Size: {formatBytes(convertedSize)}
                    </p>
                  )}
                  <a
                    href={convertedImageSrc}
                    download={getDownloadFilename()}
                    className="mt-4 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    <DownloadIcon className="w-5 h-5 mr-2"/>
                    Download Image
                  </a>
                </div>
              )}
            </div>
        )}

        {error && (
            <p className="text-red-500 text-sm text-center mt-4 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>
        )}
      </div>
    );
};

export default ImageConverter;
