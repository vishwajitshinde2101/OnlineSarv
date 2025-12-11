import React, { useState, useRef } from 'react';
import { formatBytes } from '../utils/formatBytes';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';

const ImageResizer: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
    
    const [newWidth, setNewWidth] = useState<string>('');
    const [newHeight, setNewHeight] = useState<string>('');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

    const [resizedImageSrc, setResizedImageSrc] = useState<string | null>(null);
    const [resizedSize, setResizedSize] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please select a JPG, PNG, WEBP, or GIF image.');
            return;
        }

        setError(null);
        setResizedImageSrc(null);
        setResizedSize(null);
        setOriginalFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            setOriginalImageSrc(imgSrc);

            const image = new Image();
            image.onload = () => {
                setOriginalDimensions({ width: image.width, height: image.height });
                setNewWidth(String(image.width));
                setNewHeight(String(image.height));
            };
            image.src = imgSrc;
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

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const width = e.target.value;
        setNewWidth(width);
        if (maintainAspectRatio && originalDimensions && originalDimensions.height > 0) {
            const aspectRatio = originalDimensions.width / originalDimensions.height;
            const newHeightValue = Math.round(Number(width) / aspectRatio) || '';
            setNewHeight(String(newHeightValue));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const height = e.target.value;
        setNewHeight(height);
        if (maintainAspectRatio && originalDimensions && originalDimensions.width > 0) {
            const aspectRatio = originalDimensions.width / originalDimensions.height;
            const newWidthValue = Math.round(Number(height) * aspectRatio) || '';
            setNewWidth(String(newWidthValue));
        }
    };

    const handleResize = () => {
        if (!originalImageSrc || !newWidth || !newHeight) {
            setError("Please enter valid width and height.");
            return;
        }

        const width = parseInt(newWidth, 10);
        const height = parseInt(newHeight, 10);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            setError("Dimensions must be positive numbers greater than zero.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResizedImageSrc(null);
        setResizedSize(null);

        const image = new Image();
        image.src = originalImageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setError('Could not get canvas context.');
                setIsLoading(false);
                return;
            }

            ctx.drawImage(image, 0, 0, width, height);
            const mimeType = originalFile?.type === 'image/gif' ? 'image/png' : (originalFile?.type || 'image/jpeg');
            const resizedDataUrl = canvas.toDataURL(mimeType);
            setResizedImageSrc(resizedDataUrl);

            fetch(resizedDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    setResizedSize(blob.size);
                    setIsLoading(false);
                });
        };
        image.onerror = () => {
            setError('Could not load image to resize.');
            setIsLoading(false);
        };
    };

    const handleReset = () => {
        setOriginalFile(null);
        setOriginalImageSrc(null);
        setOriginalDimensions(null);
        setNewWidth('');
        setNewHeight('');
        setResizedImageSrc(null);
        setResizedSize(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const getDownloadFilename = () => {
        if (!originalFile) return 'resized-image.jpg';
        const name = originalFile.name.replace(/\.[^/.]+$/, "");
        const ext = originalFile.type === 'image/gif' ? 'png' : (originalFile.type.split('/')[1] || 'jpg');
        return `${name}-resized-${newWidth}x${newHeight}.${ext}`;
    }

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
            <p className="text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP, GIF</p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileInputChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
            />
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Controls & Original Image */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Controls</h3>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Width (px)</label>
                        <input id="width" type="number" value={newWidth} onChange={handleWidthChange} className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" min="1"/>
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (px)</label>
                        <input id="height" type="number" value={newHeight} onChange={handleHeightChange} className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" min="1"/>
                    </div>
                </div>
                <button onClick={() => setMaintainAspectRatio(!maintainAspectRatio)} className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  {maintainAspectRatio ? <LockIcon className="w-4 h-4" /> : <UnlockIcon className="w-4 h-4" />}
                  <span>{maintainAspectRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button onClick={handleResize} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-50">
                    {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Resizing...</> : 'Resize Image'}
                  </button>
                  <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Reset</button>
              </div>

              <div className="mt-8 text-center">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Original Image</h3>
                  <img src={originalImageSrc!} alt="Original preview" className="max-w-full h-auto max-h-60 mx-auto rounded-lg shadow-md" />
                  {originalDimensions && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {originalDimensions.width} x {originalDimensions.height} px
                      </p>
                  )}
              </div>
            </div>

            {/* Right Column: Result */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Resized Result</h3>
              <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner flex items-center justify-center p-4">
                {isLoading ? (
                  <SpinnerIcon className="w-12 h-12 text-brand-primary" />
                ) : resizedImageSrc ? (
                  <div>
                    <img src={resizedImageSrc} alt="Resized preview" className="max-w-full max-h-64 h-auto rounded-lg shadow-md" />
                     <div className="mt-4">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{newWidth} x {newHeight} px</p>
                        {resizedSize !== null && <p className="text-sm text-gray-600 dark:text-gray-400">New Size: {formatBytes(resizedSize)}</p>}
                        <a href={resizedImageSrc} download={getDownloadFilename()} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center">
                            <DownloadIcon className="w-5 h-5 mr-2"/> Download Image
                        </a>
                     </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Your resized image will appear here.</p>
                )}
              </div>
            </div>

            </div>
        )}
        {error && (
            <p className="text-red-500 text-sm text-center mt-4 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>
        )}
      </div>
    );
};

export default ImageResizer;
