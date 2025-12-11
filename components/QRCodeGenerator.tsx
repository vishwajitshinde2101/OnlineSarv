import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import DownloadIcon from './icons/DownloadIcon';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://onlinesarv.com');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, { width: 256, margin: 2 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [text]);
  
  const handleDownload = () => {
      if(canvasRef.current) {
          const link = document.createElement('a');
          link.download = 'qrcode.png';
          link.href = canvasRef.current.toDataURL('image/png');
          link.click();
      }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-4">
          <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter text or URL
          </label>
          <input
            type="text"
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="bg-white p-4 inline-block rounded-lg shadow-md">
            <canvas ref={canvasRef} />
        </div>
        <div className="mt-6">
            <button
                onClick={handleDownload}
                disabled={!text}
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Download QR Code
            </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;