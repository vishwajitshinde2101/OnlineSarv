import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

const SplitPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [range, setRange] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Invalid file type. Please select a PDF.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setIsLoading(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
      setRange(`1-${pdf.getPageCount()}`);
    } catch (e: any) {
      setError(`Failed to load PDF: ${e.message}`);
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Parses ranges like "1, 3-5, 8" into an array of page indices [0, 2, 3, 4, 7]
  const parseRange = (rangeStr: string, max: number): number[] => {
      const indices = new Set<number>();
      const parts = rangeStr.split(',');
      for(const part of parts) {
          if (part.includes('-')) {
              const [start, end] = part.split('-').map(Number);
              if (!isNaN(start) && !isNaN(end)) {
                  for (let i=start; i<=end; i++) {
                      if (i > 0 && i <= max) indices.add(i-1);
                  }
              }
          } else {
              const pageNum = Number(part);
              if (!isNaN(pageNum) && pageNum > 0 && pageNum <= max) {
                  indices.add(pageNum - 1);
              }
          }
      }
      return Array.from(indices).sort((a,b) => a - b);
  }

  const handleSplit = async () => {
    if (!file) return;
    
    const pageIndices = parseRange(range, totalPages);
    if(pageIndices.length === 0) {
        setError("Invalid page range. Please enter valid page numbers.");
        return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `split-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (e: any) {
      setError(`An error occurred during splitting: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setRange('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-xl mx-auto">
        {!file ? (
          <div 
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors mb-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload a PDF to Split</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Extract specific pages from your document</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              accept="application/pdf"
              className="hidden"
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="font-semibold text-center text-gray-700 dark:text-gray-300 truncate mb-2">{file.name}</p>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">Total pages: {totalPages}</p>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pages to extract</label>
                    <input type="text" id="range" value={range} onChange={e => setRange(e.target.value)} placeholder="e.g., 1-3, 5, 8" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    <p className="text-xs text-gray-500 mt-1">Use commas for individual pages and hyphens for ranges.</p>
                </div>
                <button
                    onClick={handleSplit}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Splitting...</> : <><DownloadIcon className="w-5 h-5 mr-2" /> Split & Download</>}
                </button>
                 <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Use Another PDF
                 </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SplitPdf;