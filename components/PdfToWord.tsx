import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

// Set workerSrc for pdf.js to work correctly from the CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

const PdfToWord: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversionSuccess, setConversionSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setError('Please select a valid PDF file.');
            return;
        }
        setError(null);
        setPdfFile(file);
        setConversionSuccess(false);
    };

    const handleReset = () => {
        setPdfFile(null);
        setError(null);
        setIsLoading(false);
        setConversionSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleConvert = async () => {
        if (!pdfFile) return;

        setIsLoading(true);
        setError(null);
        setConversionSuccess(false);

        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
            const pdf = await loadingTask.promise;
            
            const pageTexts: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join('');
                pageTexts.push(pageText);
            }
            
            const fullText = pageTexts.join('\n\n');

            const paragraphs = fullText.split('\n').map(text => 
                new Paragraph({
                    children: [new TextRun(text)]
                })
            );
            
            const doc = new Document({
                sections: [{ children: paragraphs }]
            });
            
            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const docxFilename = pdfFile.name.replace(/\.pdf$/i, '.docx');
            link.download = docxFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setConversionSuccess(true);

        } catch (e: any) {
            setError(`Failed to process PDF: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="max-w-xl mx-auto">
                {!pdfFile ? (
                    <div
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload PDF to Convert to Word</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Extracts text into a DOCX file.</p>
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} accept="application/pdf" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 truncate mb-4">{pdfFile.name}</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleConvert}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Converting...</> : <><DownloadIcon className="w-5 h-5 mr-2" /> Convert & Download</>}
                            </button>
                            <button onClick={handleReset} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Use Another PDF
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}

                {conversionSuccess && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-center text-green-700 dark:text-green-300 mb-2">Conversion Successful!</h3>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                The text from your PDF has been extracted and your DOCX file download should begin automatically.
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                                Please note: This tool extracts text only. Images, tables, and complex formatting are not preserved.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfToWord;