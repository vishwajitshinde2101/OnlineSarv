import React, { useState, useRef } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

const AudioExtractor: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const bufferToWave = (abuffer: AudioBuffer): Blob => {
        const numOfChan = abuffer.numberOfChannels;
        const length = abuffer.length * numOfChan * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);
        const channels = [];
        let pos = 0;

        const setUint16 = (data: number) => {
            view.setUint16(pos, data, true);
            pos += 2;
        };

        const setUint32 = (data: number) => {
            view.setUint32(pos, data, true);
            pos += 4;
        };
        
        // WAVE header
        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8);
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt "
        setUint32(16);
        setUint16(1); // PCM
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data"
        setUint32(length - pos - 4);

        for (let i = 0; i < abuffer.numberOfChannels; i++) {
            channels.push(abuffer.getChannelData(i));
        }

        let offset = 0;
        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = sample < 0 ? sample * 32768 : sample * 32767;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const handleFileChange = (file: File) => {
        if (!file) return;
        if (!file.type.startsWith('video/')) {
            setError('Please select a video file.');
            return;
        }
        setError(null);
        setVideoFile(file);
        setVideoSrc(URL.createObjectURL(file));
        setAudioSrc(null); // Clear previous results
    };
    
    const handleExtract = async () => {
        if (!videoFile) return;

        setIsLoading(true);
        setError(null);
        setAudioSrc(null);
        
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const arrayBuffer = await videoFile.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const wavBlob = bufferToWave(audioBuffer);
            const url = URL.createObjectURL(wavBlob);
            setAudioSrc(url);
        } catch(e: any) {
            setError(`Failed to extract audio. The video might not have an audio track or it's in an unsupported format. Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setVideoFile(null);
        if (videoSrc) URL.revokeObjectURL(videoSrc);
        if (audioSrc) URL.revokeObjectURL(audioSrc);
        setVideoSrc(null);
        setAudioSrc(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getDownloadFilename = () => {
        if (!videoFile) return 'audio.wav';
        const name = videoFile.name.replace(/\.[^/.]+$/, "");
        return `${name}.wav`;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="max-w-3xl mx-auto">
                {!videoFile ? (
                     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload a Video to Extract Audio</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">MP4, WEBM, MOV, etc.</p>
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} accept="video/*" className="hidden" />
                    </div>
                ) : (
                    <div>
                        <video src={videoSrc!} controls className="w-full rounded-lg shadow-md mb-4"></video>
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button onClick={handleExtract} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
                                {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Extracting...</> : 'Extract Audio'}
                            </button>
                            <button onClick={handleReset} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Use Another Video</button>
                        </div>

                        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
                        
                        {audioSrc && (
                            <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Extracted Audio (WAV)</h3>
                                <audio src={audioSrc} controls className="w-full"></audio>
                                <a href={audioSrc} download={getDownloadFilename()} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center">
                                    <DownloadIcon className="w-5 h-5 mr-2"/> Download WAV
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AudioExtractor;