import React from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';

const PdfToExcel: React.FC = () => {
    return (
         <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="max-w-3xl mx-auto">
                 <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload PDF to Convert to Excel</h3>
                    <button className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed">Select PDF</button>
                </div>
                <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md mt-6">
                    Extracting tables from PDFs into editable Excel spreadsheets requires sophisticated OCR and data recognition technology. This feature is currently in development and will be available soon.
                </p>
            </div>
        </div>
    );
};

export default PdfToExcel;