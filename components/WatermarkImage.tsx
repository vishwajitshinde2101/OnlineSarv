import React, { useState, useRef, useEffect } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

const WatermarkImage: React.FC = () => {
    // File and image states
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [resultImageSrc, setResultImageSrc] = useState<string | null>(null);

    // Watermark type
    const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
    
    // Text watermark states
    const [text, setText] = useState('Your Watermark');
    const [textColor, setTextColor] = useState('#ffffff');
    const [textSize, setTextSize] = useState(48);
    
    // Image watermark states
    const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
    const [watermarkImageSrc, setWatermarkImageSrc] = useState<string | null>(null);

    // Common watermark states
    const [opacity, setOpacity] = useState(0.7);
    const [position, setPosition] = useState('center');
    const [rotation, setRotation] = useState(0);

    // App state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const watermarkInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (file: File, target: 'original' | 'watermark') => {
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError(`Invalid file type for ${target} image. Please use JPG, PNG, or WEBP.`);
            return;
        }
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (target === 'original') {
                setOriginalFile(file);
                setOriginalImageSrc(result);
                setResultImageSrc(null);
            } else {
                setWatermarkFile(file);
                setWatermarkImageSrc(result);
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        let isCancelled = false;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !originalImageSrc) return;
    
        const originalImg = new Image();
        const watermarkImg = new Image();
    
        const renderCanvas = () => {
            if (isCancelled || !canvasRef.current) return;
            const currentCanvas = canvasRef.current;
            const currentCtx = currentCanvas.getContext('2d');
            if (!currentCtx) return;
    
            currentCanvas.width = originalImg.width;
            currentCanvas.height = originalImg.height;
            currentCtx.drawImage(originalImg, 0, 0);
    
            let x, y;
            currentCtx.textAlign = 'center';
            currentCtx.textBaseline = 'middle';
            switch (position) {
                case 'top-left': x = 20; y = 20; currentCtx.textAlign = 'left'; currentCtx.textBaseline = 'top'; break;
                case 'top-center': x = currentCanvas.width / 2; y = 20; currentCtx.textBaseline = 'top'; break;
                case 'top-right': x = currentCanvas.width - 20; y = 20; currentCtx.textAlign = 'right'; currentCtx.textBaseline = 'top'; break;
                case 'bottom-left': x = 20; y = currentCanvas.height - 20; currentCtx.textAlign = 'left'; currentCtx.textBaseline = 'bottom'; break;
                case 'bottom-center': x = currentCanvas.width / 2; y = currentCanvas.height - 20; currentCtx.textBaseline = 'bottom'; break;
                case 'bottom-right': x = currentCanvas.width - 20; y = currentCanvas.height - 20; currentCtx.textAlign = 'right'; currentCtx.textBaseline = 'bottom'; break;
                default: x = currentCanvas.width / 2; y = currentCanvas.height / 2; break;
            }
    
            currentCtx.save();
            currentCtx.globalAlpha = opacity;
            currentCtx.translate(x, y);
            currentCtx.rotate((rotation * Math.PI) / 180);
    
            if (watermarkType === 'text' && text) {
                currentCtx.fillStyle = textColor;
                currentCtx.font = `${textSize}px Arial`;
                currentCtx.fillText(text, 0, 0);
            } else if (watermarkType === 'image' && watermarkImg.complete && watermarkImg.src) {
                const scale = 0.2 * (currentCanvas.width / watermarkImg.width);
                const w = watermarkImg.width * scale;
                const h = watermarkImg.height * scale;
                currentCtx.drawImage(watermarkImg, -w / 2, -h / 2, w, h);
            }
    
            currentCtx.restore();
        };
    
        let originalLoaded = false;
        let watermarkLoaded = watermarkType !== 'image' || !watermarkImageSrc;
    
        originalImg.onload = () => {
            originalLoaded = true;
            if (watermarkLoaded) renderCanvas();
        };
        originalImg.onerror = () => setError("Failed to load the main image.");
    
        if (!watermarkLoaded) {
            watermarkImg.onload = () => {
                watermarkLoaded = true;
                if (originalLoaded) renderCanvas();
            };
            watermarkImg.onerror = () => setError("Failed to load watermark image.");
            watermarkImg.src = watermarkImageSrc!;
        }
    
        originalImg.src = originalImageSrc;
    
        return () => {
            isCancelled = true;
        };
    }, [originalImageSrc, text, textColor, textSize, watermarkImageSrc, opacity, position, rotation, watermarkType]);

    const handleApplyWatermark = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setIsLoading(true);
        setTimeout(() => {
            setResultImageSrc(canvas.toDataURL(originalFile?.type || 'image/jpeg'));
            setIsLoading(false);
        }, 100);
    };

    const handleReset = () => {
        setOriginalFile(null);
        setOriginalImageSrc(null);
        setResultImageSrc(null);
        setWatermarkFile(null);
        setWatermarkImageSrc(null);
        setText('Your Watermark');
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (watermarkInputRef.current) watermarkInputRef.current.value = '';
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'original' | 'watermark') => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileChange(e.target.files[0], target);
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0], 'original');
            e.dataTransfer.clearData();
        }
    };
    
    const renderControls = () => (
        <div className="space-y-4">
            <div className="flex gap-4">
                <button onClick={() => setWatermarkType('text')} className={`w-full py-2 rounded transition-colors ${watermarkType === 'text' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Text</button>
                <button onClick={() => setWatermarkType('image')} className={`w-full py-2 rounded transition-colors ${watermarkType === 'image' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Image</button>
            </div>

            {watermarkType === 'text' && (
                <div className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Text</label>
                        <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full mt-1 p-1 h-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer" />
                        </div>
                        <div className="flex-grow w-2/3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Size ({textSize}px)</label>
                            <input type="range" min="10" max="200" value={textSize} onChange={e => setTextSize(parseInt(e.target.value))} className="w-full mt-2" />
                        </div>
                    </div>
                </div>
            )}

            {watermarkType === 'image' && (
                <div className="p-4 border dark:border-gray-600 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Watermark Image</label>
                    <input type="file" ref={watermarkInputRef} onChange={e => onFileInputChange(e, 'watermark')} accept="image/jpeg,image/png,image/webp" className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent/20 file:text-brand-primary hover:file:bg-brand-accent/30 dark:file:text-brand-accent cursor-pointer" />
                </div>
            )}
            
            <div className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opacity ({Math.round(opacity * 100)}%)</label>
                    <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rotation ({rotation}°)</label>
                    <input type="range" min="-180" max="180" value={rotation} onChange={e => setRotation(parseInt(e.target.value))} className="w-full mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                    <select value={position} onChange={e => setPosition(e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-center">Top Center</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                    </select>
                </div>
            </div>
            
            <button onClick={handleApplyWatermark} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                 {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Applying...</> : 'Apply & Preview'}
            </button>
        </div>
    );
    
    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            {!originalFile ? (
                <div 
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver} onDrop={onDrop}
                >
                    <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag & drop</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                    <input type="file" ref={fileInputRef} onChange={e => onFileInputChange(e, 'original')} accept="image/jpeg,image/png,image/webp" className="hidden" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="order-2 lg:order-1">{renderControls()}</div>

                    <div className="order-1 lg:order-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-4">Preview</h3>
                        <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-inner overflow-hidden p-2">
                            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                        </div>
                    </div>
                </div>
            )}

            {resultImageSrc && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Watermarked Image</h3>
                    <img src={resultImageSrc} alt="Watermarked result" className="max-w-full max-h-96 mx-auto rounded-lg shadow-md" />
                    <a href={resultImageSrc} download={`watermarked-${originalFile?.name}`} className="mt-4 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        <DownloadIcon className="w-5 h-5 mr-2" /> Download Image
                    </a>
                </div>
            )}
            
            {originalFile && (
                <div className="text-center mt-4">
                    <button onClick={handleReset} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent font-semibold py-2 px-4 rounded-lg transition-colors">
                        Use Another Image
                    </button>
                </div>
            )}

            {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
        </div>
    );
}

export default WatermarkImage;