import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import { formatBytes } from '../utils/formatBytes';

// Set workerSrc for pdf.js to work correctly from the CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

const CompressPdf: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [compressedSize, setCompressedSize] = useState<number | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    
    const [quality, setQuality] = useState(0.75); // 0.75 JPEG quality
    const [dpi, setDpi] = useState(150); // 150 DPI

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setError('Please select a valid PDF file.');
            return;
        }
        handleReset();
        setPdfFile(file);
        setOriginalSize(file.size);
    };

    const handleReset = () => {
        setPdfFile(null);
        setError(null);
        setIsLoading(false);
        setOriginalSize(null);
        setCompressedSize(null);
        setProgressMessage('');
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
        }
        setDownloadUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCompress = async () => {
        if (!pdfFile) return;

        setIsLoading(true);
        setError(null);
        setCompressedSize(null);
        setProgressMessage('Starting compression...');
        if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);

        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            const newPdfDoc = await PDFDocument.create();

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgressMessage(`Processing page ${i} of ${pdf.numPages}...`);
                
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: dpi / 72 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (!context) {
                    throw new Error('Could not get canvas context');
                }

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
                const jpegImageBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
                
                const jpegImage = await newPdfDoc.embedJpg(jpegImageBytes);
                
                const { width, height } = page.getViewport({ scale: 1 });
                const newPage = newPdfDoc.addPage([width, height]);
                newPage.drawImage(jpegImage, {
                    x: 0,
                    y: 0,
                    width: newPage.getWidth(),
                    height: newPage.getHeight(),
                });
            }

            setProgressMessage('Finalizing PDF...');
            const pdfBytes = await newPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });

            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

        } catch (e: any) {
            setError(`Failed to process PDF: ${e.message}`);
        } finally {
            setIsLoading(false);
            setProgressMessage('');
        }
    };

    const sizeReduction = originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="max-w-xl mx-auto">
                {!pdfFile ? (
                    <div
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload PDF to Compress</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Reduce file size by converting pages to optimized images.</p>
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} accept="application/pdf" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 truncate mb-2">{pdfFile.name}</p>
                        {originalSize && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Original Size: {formatBytes(originalSize)}</p>}
                        
                        <div className="space-y-4 mb-6 text-left">
                            <div>
                                <label htmlFor="dpi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Quality (DPI)</label>
                                <select id="dpi" value={dpi} onChange={e => setDpi(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                    <option value="72">Low (72 DPI - Smaller file)</option>
                                    <option value="150">Medium (150 DPI - Balanced)</option>
                                    <option value="300">High (300 DPI - Better quality)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">JPEG Compression ({Math.round(quality * 100)}%)</label>
                                <input type="range" id="quality" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full mt-1" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleCompress}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Compressing...</> : 'Compress PDF'}
                            </button>
                            <button onClick={handleReset} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Use Another PDF
                            </button>
                        </div>
                    </div>
                )}
                
                {isLoading && progressMessage && <p className="text-center text-gray-600 dark:text-gray-400 mt-4">{progressMessage}</p>}

                {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}

                {downloadUrl && compressedSize !== null && (
                    <div className="mt-6 text-center p-4 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
                        <h4 className="text-lg font-bold text-green-800 dark:text-green-200">Compression Complete!</h4>
                        <p className="font-semibold text-green-700 dark:text-green-300 mt-1">
                            New Size: {formatBytes(compressedSize)}
                        </p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                            -{sizeReduction}%
                        </p>
                        <a
                            href={downloadUrl}
                            download={`compressed-${pdfFile?.name}`}
                            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                        >
                            <DownloadIcon className="w-5 h-5 mr-2"/> Download Compressed PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompressPdf;
