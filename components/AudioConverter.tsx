import React, { useState, useRef } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';

const AudioConverter: React.FC = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;
        setAudioFile(file);
        setAudioSrc(URL.createObjectURL(file));
    };

    const handleReset = () => {
        setAudioFile(null);
        if (audioSrc) URL.revokeObjectURL(audioSrc);
        setAudioSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="max-w-3xl mx-auto">
                {!audioFile ? (
                     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload Audio to Convert</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">MP3, WAV, M4A, FLAC etc.</p>
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} accept="audio/*" className="hidden" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <audio src={audioSrc!} controls className="w-full rounded-lg shadow-md"></audio>
                             <p className="text-center mt-2 text-sm text-gray-500 truncate">{audioFile.name}</p>
                            <button onClick={handleReset} className="w-full mt-4 text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent font-semibold py-2 px-4 rounded-lg transition-colors">Use Another File</button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Convert to</label>
                                <select className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" disabled>
                                    <option>MP3</option>
                                    <option>WAV</option>
                                    <option>M4A</option>
                                    <option>FLAC</option>
                                </select>
                            </div>
                            <button className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg opacity-50 cursor-not-allowed">Convert Audio</button>
                            <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md">
                                Client-side audio conversion is a complex feature that is currently under development. Check back soon!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioConverter;