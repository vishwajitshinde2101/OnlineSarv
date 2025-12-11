import React, { useState, useRef } from 'react';
import { formatBytes } from '../utils/formatBytes';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [compressedImageSrc, setCompressedImageSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please select a JPG, PNG, or WEBP image.');
      return;
    }

    setError(null);
    setCompressedImageSrc(null);
    setCompressedSize(null);
    setOriginalFile(file);
    setOriginalSize(file.size);

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

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  const handleCompress = () => {
    if (!originalFile || !originalImageSrc) return;

    setIsLoading(true);
    setError(null);
    setCompressedImageSrc(null);
    setCompressedSize(null);

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
      
      const mimeType = 'image/jpeg';
      const qualityToUse = quality;


      ctx.drawImage(image, 0, 0);

      const compressedDataUrl = canvas.toDataURL(mimeType, qualityToUse);
      setCompressedImageSrc(compressedDataUrl);

      // Convert data URL to blob to get the size
      fetch(compressedDataUrl)
        .then(res => res.blob())
        .then(blob => {
          setCompressedSize(blob.size);
          setIsLoading(false);
        });
    };

    image.onerror = () => {
      setError('Could not load image to compress.');
      setIsLoading(false);
    };
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalImageSrc(null);
    setCompressedImageSrc(null);
    setError(null);
    setOriginalSize(null);
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const sizeReduction = originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image & Info */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Original Image</h3>
            <img src={originalImageSrc!} alt="Original" className="max-w-full h-auto max-h-80 rounded-lg shadow-md" />
            {originalSize && (
              <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                Size: {formatBytes(originalSize)}
              </p>
            )}
          </div>

          {/* Right Column: Controls & Result */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compression Quality ({Math.round(quality * 100)}%)
              </label>
              <input
                type="range"
                id="quality"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              {originalFile.type === 'image/png' && (
                <p className="text-xs text-gray-500 mt-1">PNG files will be converted to JPG to apply quality-based compression.</p>
              )}
            </div>
            
            <button
              onClick={handleCompress}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2" />
                  Compressing...
                </>
              ) : 'Compress Image'}
            </button>
            
            {compressedImageSrc && compressedSize != null && (
              <div className="mt-6 text-center p-4 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
                <h4 className="text-lg font-bold text-green-800 dark:text-green-200">Compression Complete!</h4>
                <p className="font-semibold text-green-700 dark:text-green-300 mt-1">
                  New Size: {formatBytes(compressedSize)}
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                  -{sizeReduction}%
                </p>
                <a
                  href={compressedImageSrc}
                  download={`compressed-${originalFile?.name.replace(/\.[^/.]+$/, "")}.jpg`}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <DownloadIcon className="w-5 h-5 mr-2"/>
                  Download Image
                </a>
              </div>
            )}
            
            <button
              onClick={handleReset}
              className="w-full mt-4 text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Compress Another Image
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center mt-4 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>
      )}
    </div>
  );
};

export default ImageCompressor;
