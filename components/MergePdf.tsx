import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import CloseIcon from './icons/CloseIcon';

interface PDFFile {
  id: number;
  file: File;
  name: string;
}

const MergePdf: React.FC = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileChange = (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const newFiles: PDFFile[] = [];
    for (const file of Array.from(fileList)) {
      if (file.type !== 'application/pdf') {
        setError(`Skipping non-PDF file: ${file.name}.`);
        continue;
      }
      newFiles.push({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
      });
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    let _files = [...files];
    const draggedItemContent = _files.splice(dragItem.current, 1)[0];
    _files.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFiles(_files);
  };

  const handleRemoveFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least two PDF files to merge.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(`An error occurred during merging: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-3xl mx-auto">
        <div 
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag & drop PDFs</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Combine multiple PDFs into one</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileChange(e.target.files)}
            accept="application/pdf"
            className="hidden"
            multiple
          />
        </div>
        
        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-4">{error}</p>}

        {files.length > 0 && (
          <>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">You have added {files.length} file(s). Drag and drop to reorder.</p>
            <ul className="space-y-2 mb-6">
                {files.map((file, index) => (
                <li 
                    key={file.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow cursor-grab"
                    draggable
                    onDragStart={() => dragItem.current = index}
                    onDragEnter={() => dragOverItem.current = index}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <span className="font-medium text-gray-700 dark:text-gray-300">{index + 1}. {file.name}</span>
                    <button onClick={() => handleRemoveFile(file.id)} className="text-gray-400 hover:text-red-500"><CloseIcon className="w-5 h-5"/></button>
                </li>
                ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={handleMerge}
                    disabled={isLoading || files.length < 2}
                    className="w-full sm:w-auto flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Merging...</> : <><DownloadIcon className="w-5 h-5 mr-2" /> Merge & Download</>}
                </button>
                 <button onClick={handleReset} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Reset
                 </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MergePdf;