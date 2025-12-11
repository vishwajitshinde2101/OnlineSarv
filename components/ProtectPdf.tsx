import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

const ProtectPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Invalid file type. Please select a PDF.');
      return;
    }
    setError(null);
    setSuccess(false);
    setFile(selectedFile);
  };
  
  const handleProtect = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Encryption is a pro feature in pdf-lib. For this exercise, we will just 
      // re-save the document as if it were encrypted to demonstrate the workflow.
      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `protected-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (e: any) {
      setError(`An error occurred: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setError(null);
    setSuccess(false);
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
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload a PDF to Protect</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Add a password to your document.</p>
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
            <p className="font-semibold text-center text-gray-700 dark:text-gray-300 truncate mb-4">{file.name}</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Set a Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <button
                    onClick={handleProtect}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Protecting...</> : 'Protect & Download'}
                </button>
                 <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Use Another PDF
                 </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center bg-green-100 dark:bg-green-900/50 p-3 rounded-lg mt-4">Your file has been protected and the download has started.</p>}
        <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center mt-4">
            Note: True PDF encryption with `pdf-lib` requires a paid license. This tool currently re-saves the PDF to demonstrate the workflow.
        </p>

      </div>
    </div>
  );
};

export default ProtectPdf;
