import React, { useState, useRef, useEffect } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';
import DownloadIcon from './icons/DownloadIcon';

const AddSubtitles: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [subtitleSrc, setSubtitleSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
      if (subtitleSrc) URL.revokeObjectURL(subtitleSrc);
    };
  }, [videoSrc, subtitleSrc]);

  const handleVideoChange = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Invalid file type. Please select a video file.');
      return;
    }
    setError(null);
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoFile(file);
    setVideoSrc(URL.createObjectURL(file));
  };

  const srtToVtt = (srtText: string): string => {
    let vttText = "WEBVTT\n\n";
    // Basic conversion: replace comma with dot in timestamps and remove index numbers
    vttText += srtText
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
      .replace(/^\d+\s*$/gm, '');
    return vttText;
  };

  const handleSubtitleChange = (file: File) => {
    if (!file) return;
    if (!file.name.endsWith('.srt') && !file.name.endsWith('.vtt')) {
      setError('Invalid file type. Please select an SRT or VTT file.');
      return;
    }
    setError(null);
    if (subtitleSrc) URL.revokeObjectURL(subtitleSrc);
    setSubtitleFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target?.result as string;
      if (file.name.endsWith('.srt')) {
        content = srtToVtt(content);
      }
      const blob = new Blob([content], { type: 'text/vtt' });
      setSubtitleSrc(URL.createObjectURL(blob));
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setVideoFile(null);
    setSubtitleFile(null);
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    if (subtitleSrc) URL.revokeObjectURL(subtitleSrc);
    setVideoSrc(null);
    setSubtitleSrc(null);
    setError(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (subtitleInputRef.current) subtitleInputRef.current.value = "";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-3xl mx-auto">
        {!videoFile ? (
          <div
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
            onClick={() => videoInputRef.current?.click()}
          >
            <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload Video File</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">MP4, WEBM, MOV, etc.</p>
            <input type="file" ref={videoInputRef} onChange={(e) => e.target.files && handleVideoChange(e.target.files[0])} accept="video/*" className="hidden" />
          </div>
        ) : (
          <div>
            <div className="relative mb-6 bg-black rounded-lg shadow-lg">
              <video
                key={videoSrc}
                controls
                crossOrigin="anonymous"
                className="w-full max-h-[60vh] rounded-lg"
              >
                <source src={videoSrc!} type={videoFile.type} />
                {subtitleSrc && (
                  <track
                    label="English"
                    kind="subtitles"
                    srcLang="en"
                    src={subtitleSrc}
                    default
                  />
                )}
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Subtitle File (.srt or .vtt)</label>
                  <input type="file" ref={subtitleInputRef} onChange={(e) => e.target.files && handleSubtitleChange(e.target.files[0])} accept=".srt,.vtt" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent/20 file:text-brand-primary hover:file:bg-brand-accent/30 dark:file:text-brand-accent cursor-pointer"/>
                </div>
                 <p className="text-xs text-center text-gray-500 dark:text-gray-400">Note: Subtitles are displayed for preview only and are not burned into the video upon download.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={videoSrc!} download={videoFile.name} className="w-full sm:w-auto flex-grow flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      <DownloadIcon className="w-5 h-5 mr-2" /> Download Video
                  </a>
                  <button onClick={handleReset} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Use Another Video</button>
                </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
      </div>
    </div>
  );
};
export default AddSubtitles;