import React, { useState, useRef } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';

const MergeAudio: React.FC = () => {
    const [audioFiles, setAudioFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (files: FileList) => {
        if (!files) return;
        setAudioFiles(prev => [...prev, ...Array.from(files)]);
    };

    const handleReset = () => {
        setAudioFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    return (
         <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="max-w-3xl mx-auto">
                 <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors mb-6" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload Audio Files to Merge</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">MP3, WAV, M4A, etc.</p>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files)} accept="audio/*" className="hidden" multiple/>
                </div>

                {audioFiles.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h4 className="font-bold mb-2">Files to Merge ({audioFiles.length}):</h4>
                        <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
                            {audioFiles.map((file, index) => <li key={index}>{file.name}</li>)}
                        </ul>
                        <button className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg opacity-50 cursor-not-allowed">Merge Audio Files</button>
                        <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md mt-4">
                             Merging multiple audio files client-side is an intensive task. This feature is currently under development.
                        </p>
                        <button onClick={handleReset} className="w-full mt-4 text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent font-semibold py-2 px-4 rounded-lg transition-colors">Clear All Files</button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MergeAudio;