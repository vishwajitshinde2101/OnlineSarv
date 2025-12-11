import React, { useState, useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import CropIcon from './icons/CropIcon';
import SlidersIcon from './icons/SlidersIcon';
import FilterIcon from './icons/FilterIcon';
import UndoIcon from './icons/UndoIcon';
import RedoIcon from './icons/RedoIcon';
import RotateCwIcon from './icons/RotateCwIcon';
import RotateCcwIcon from './icons/RotateCcwIcon';
import FlipHorizontalIcon from './icons/FlipHorizontalIcon';
import FlipVerticalIcon from './icons/FlipVerticalIcon';

type ActiveTool = 'crop' | 'adjust' | 'filter' | null;

const DRAFT_KEY = 'photoEditorDraft';

// Helper to convert a data URL to a File object
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    try {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        return null;
    }
};


const PhotoEditor: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeTool, setActiveTool] = useState<ActiveTool>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [draftToRestore, setDraftToRestore] = useState<any | null>(null);
    
    // Adjustment states
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<fabric.Image | null>(null);
    const originalImageSrcRef = useRef<string | null>(null);

    // FIX: Create a ref to hold current state for use in stable callbacks, preventing stale closures.
    const stateRef = useRef({ history, historyIndex, canvas });
    useEffect(() => {
        stateRef.current = { history, historyIndex, canvas };
    }, [history, historyIndex, canvas]);

    const initCanvas = () => {
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: 0,
            height: 0,
            backgroundColor: '#f0f0f0',
        });
        setCanvas(newCanvas);
        return newCanvas;
    };
    
    // FIX: Make saveState a stable function by reading from the state ref.
    // This breaks the dependency cycle in the main useEffect.
    const saveState = useCallback(() => {
        const { canvas: currentCanvas, history: currentHistory, historyIndex: currentIndex } = stateRef.current;
        if (!currentCanvas || !currentCanvas.getObjects().length) return;
        
        const newState = JSON.stringify(currentCanvas.toDatalessJSON());
        const newHistory = currentHistory.slice(0, currentIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, []); // Empty dependency array makes this function stable.
    
    // Check for draft on mount
    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
                setDraftToRestore(JSON.parse(savedDraft));
            }
        } catch (error) {
            console.error("Failed to load draft:", error);
            localStorage.removeItem(DRAFT_KEY);
        }
    }, []);

    // Auto-save effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (canvas && imageFile && originalImageSrcRef.current) {
                const draft = {
                    fileName: imageFile.name,
                    imageSrc: originalImageSrcRef.current,
                    canvasState: canvas.toDatalessJSON(),
                    history,
                    historyIndex,
                    brightness,
                    contrast,
                    saturation,
                };
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
            }
        }, 5000); // Save every 5 seconds

        return () => clearInterval(interval);
    }, [canvas, imageFile, history, historyIndex, brightness, contrast, saturation]);
    
    // FIX: This useEffect now has a stable dependency, so it will only run once on mount.
    // This prevents the canvas from being disposed and recreated repeatedly, fixing the error.
    useEffect(() => {
        const canvasInstance = initCanvas();
        
        canvasInstance.on('object:modified', saveState);

        return () => {
            canvasInstance.off('object:modified', saveState);
            canvasInstance.dispose();
        };
    }, [saveState]);

    useEffect(() => {
        if (!canvas) return;
        const isDark = document.documentElement.classList.contains('dark');
        canvas.backgroundColor = isDark ? '#374151' : '#f3f4f6';
        canvas.renderAll();
    }, [canvas]);

    const clearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
    };

    const handleFileChange = (file: File) => {
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) return;
        
        clearDraft();
        setDraftToRestore(null);
        setImageFile(file);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            originalImageSrcRef.current = imgSrc;

            fabric.Image.fromURL(imgSrc, (img) => {
                if (!canvas) return;
                imageRef.current = img;

                const container = canvas.getElement().parentElement;
                if (!container) return;

                const { clientWidth: containerWidth, clientHeight: containerHeight } = container;
                const scale = Math.min(containerWidth / img.width!, containerHeight / img.height!);

                canvas.setWidth(containerWidth);
                canvas.setHeight(containerHeight);
                
                img.scale(scale);
                canvas.clear();
                canvas.add(img);
                canvas.centerObject(img);
                canvas.renderAll();
                setIsLoading(false);
                
                const initialState = JSON.stringify(canvas.toDatalessJSON());
                setHistory([initialState]);
                setHistoryIndex(0);
                
                setBrightness(0);
                setContrast(0);
                setSaturation(0);
            });
        };
        reader.readAsDataURL(file);
    };
    
    const handleRestoreDraft = () => {
        if (!draftToRestore || !canvas) return;

        const file = dataURLtoFile(draftToRestore.imageSrc, draftToRestore.fileName);
        if (!file) {
            handleDiscardDraft();
            return;
        }

        setImageFile(file);
        originalImageSrcRef.current = draftToRestore.imageSrc;
        
        canvas.loadFromJSON(draftToRestore.canvasState, () => {
            const container = canvas.getElement().parentElement;
            if (!container) return;

            const { clientWidth, clientHeight } = container;
            canvas.setWidth(clientWidth);
            canvas.setHeight(clientHeight);

            imageRef.current = canvas.getObjects('image')[0] as fabric.Image;
            canvas.renderAll();
        });

        setHistory(draftToRestore.history);
        setHistoryIndex(draftToRestore.historyIndex);
        setBrightness(draftToRestore.brightness || 0);
        setContrast(draftToRestore.contrast || 0);
        setSaturation(draftToRestore.saturation || 0);
        
        setDraftToRestore(null); // Hide the prompt
    };

    const handleDiscardDraft = () => {
        clearDraft();
        setDraftToRestore(null);
    };
    
    const handleReset = () => {
        clearDraft();
        setImageFile(null);
        originalImageSrcRef.current = null;
        canvas?.clear();
        canvas?.setWidth(0);
        canvas?.setHeight(0);
        setHistory([]);
        setHistoryIndex(-1);
        setActiveTool(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const applyFilter = useCallback((filter: fabric.IBaseFilter | false) => {
        if (!imageRef.current || !canvas) return;
        
        const image = imageRef.current;
        const currentFilters = (image.filters || []) as fabric.IBaseFilter[];
        
        if (filter) {
            image.filters = currentFilters.filter(f => f.type.toLowerCase() !== filter.type.toLowerCase());
            image.filters.push(filter);
        } else {
            image.filters = [];
        }

        image.applyFilters();
        canvas.renderAll();
    }, [canvas]);
    
    const handleAdjustmentChange = (type: 'brightness' | 'contrast' | 'saturation', value: number) => {
        let filter: fabric.IBaseFilter | null = null;
        switch(type) {
            case 'brightness':
                setBrightness(value);
                filter = new fabric.Image.filters.Brightness({ brightness: value });
                break;
            case 'contrast':
                setContrast(value);
                filter = new fabric.Image.filters.Contrast({ contrast: value });
                break;
            case 'saturation':
                setSaturation(value);
                filter = new fabric.Image.filters.Saturation({ saturation: value });
                break;
        }
        if (filter) applyFilter(filter);
    };
    
    const onAdjustmentMouseUp = () => {
       saveState();
    };

    const handleSimpleFilter = (type: 'grayscale' | 'sepia' | 'invert' | 'none') => {
        if (!imageRef.current || !canvas) return;
        const image = imageRef.current;
        image.filters = (image.filters || []).filter(f => !['Grayscale', 'Sepia', 'Invert'].includes(f.type));
        
        switch (type) {
            case 'grayscale': image.filters.push(new fabric.Image.filters.Grayscale()); break;
            case 'sepia': image.filters.push(new fabric.Image.filters.Sepia()); break;
            case 'invert': image.filters.push(new fabric.Image.filters.Invert()); break;
        }
        image.applyFilters();
        canvas.renderAll();
        saveState();
    };
    
    const handleTransform = (action: 'rotate-cw' | 'rotate-ccw' | 'flip-x' | 'flip-y') => {
        if (!imageRef.current || !canvas) return;
        const image = imageRef.current;
        switch(action) {
            case 'rotate-cw': image.angle = (image.angle || 0) + 90; break;
            case 'rotate-ccw': image.angle = (image.angle || 0) - 90; break;
            case 'flip-x': image.flipX = !image.flipX; break;
            case 'flip-y': image.flipY = !image.flipY; break;
        }
        canvas.renderAll();
        saveState();
    };

    const handleUndo = () => {
        if (historyIndex > 0 && canvas) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            canvas.loadFromJSON(history[newIndex], () => {
                imageRef.current = canvas.getObjects('image')[0] as fabric.Image;
                canvas.renderAll();
            });
        }
    };
    
    const handleRedo = () => {
        if (historyIndex < history.length - 1 && canvas) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            canvas.loadFromJSON(history[newIndex], () => {
                imageRef.current = canvas.getObjects('image')[0] as fabric.Image;
                canvas.renderAll();
            });
        }
    };

    const handleDownload = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `edited-${imageFile?.name || 'image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        handleReset(); // Clear session after download
    };

    const ToolButton = ({ name, icon: Icon, tool }: { name: string; icon: React.FC<{className?:string}>; tool: ActiveTool }) => (
        <button
            onClick={() => setActiveTool(activeTool === tool ? null : tool)}
            className={`flex flex-col items-center justify-center p-3 w-full rounded-lg transition-colors ${activeTool === tool ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{name}</span>
        </button>
    );
    
    const renderControls = () => {
        switch (activeTool) {
            case 'crop':
                return (
                    <div className="space-y-4">
                        <h4 className="font-bold text-center">Transform</h4>
                        <div className="grid grid-cols-2 gap-2">
                             <button onClick={() => handleTransform('rotate-ccw')} className="p-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"><RotateCcwIcon className="w-5 h-5 mr-2" /> -90°</button>
                             <button onClick={() => handleTransform('rotate-cw')} className="p-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"><RotateCwIcon className="w-5 h-5 mr-2" /> +90°</button>
                             <button onClick={() => handleTransform('flip-x')} className="p-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"><FlipHorizontalIcon className="w-5 h-5 mr-2" /> Flip H</button>
                             <button onClick={() => handleTransform('flip-y')} className="p-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"><FlipVerticalIcon className="w-5 h-5 mr-2" /> Flip V</button>
                        </div>
                    </div>
                );
            case 'adjust':
                return (
                    <div className="space-y-4">
                        <h4 className="font-bold text-center">Adjustments</h4>
                        <div>
                            <label className="block text-sm">Brightness: {brightness.toFixed(2)}</label>
                            <input type="range" min="-1" max="1" step="0.01" value={brightness} onChange={(e) => handleAdjustmentChange('brightness', parseFloat(e.target.value))} onMouseUp={onAdjustmentMouseUp} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm">Contrast: {contrast.toFixed(2)}</label>
                            <input type="range" min="-1" max="1" step="0.01" value={contrast} onChange={(e) => handleAdjustmentChange('contrast', parseFloat(e.target.value))} onMouseUp={onAdjustmentMouseUp} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm">Saturation: {saturation.toFixed(2)}</label>
                            <input type="range" min="-1" max="1" step="0.01" value={saturation} onChange={(e) => handleAdjustmentChange('saturation', parseFloat(e.target.value))} onMouseUp={onAdjustmentMouseUp} className="w-full" />
                        </div>
                    </div>
                );
            case 'filter':
                 return (
                    <div className="space-y-4">
                        <h4 className="font-bold text-center">Filters</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleSimpleFilter('none')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300">None</button>
                            <button onClick={() => handleSimpleFilter('grayscale')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300">Grayscale</button>
                            <button onClick={() => handleSimpleFilter('sepia')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300">Sepia</button>
                            <button onClick={() => handleSimpleFilter('invert')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300">Invert</button>
                        </div>
                    </div>
                );
            default:
                return <p className="text-center text-gray-500 dark:text-gray-400">Select a tool to start editing.</p>;
        }
    };

    if (draftToRestore) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner flex flex-col items-center justify-center h-[50vh]">
                 <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Saved Draft Found!</h3>
                 <p className="text-gray-500 dark:text-gray-400 mb-6">Would you like to restore your previous session?</p>
                 <div className="flex gap-4">
                    <button onClick={handleRestoreDraft} className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors">Restore</button>
                    <button onClick={handleDiscardDraft} className="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">Discard & Start New</button>
                 </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            {!imageFile ? (
                <div 
                    className="flex flex-col items-center justify-center h-[50vh] p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Upload an Image to Start Editing</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} accept="image/*" className="hidden" />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                           <ToolButton name="Transform" icon={CropIcon} tool="crop" />
                           <ToolButton name="Adjust" icon={SlidersIcon} tool="adjust" />
                           <ToolButton name="Filters" icon={FilterIcon} tool="filter" />
                        </div>
                        <hr className="dark:border-gray-600"/>
                        {renderControls()}
                        <hr className="dark:border-gray-600"/>
                        <div className="space-y-2">
                           <div className="flex items-center justify-center gap-2">
                               <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon className="w-5 h-5"/> </button>
                               <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon className="w-5 h-5"/> </button>
                           </div>
                           <button onClick={handleDownload} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                               <DownloadIcon className="w-5 h-5 mr-2" /> Download
                           </button>
                           <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm">
                                Start New
                           </button>
                        </div>
                    </div>
                    {/* Main Canvas */}
                    <div className="flex-grow h-[70vh] w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner flex items-center justify-center p-2 relative">
                        {isLoading && <SpinnerIcon className="w-12 h-12 text-brand-primary absolute z-10" />}
                        <canvas ref={canvasRef} className={`${isLoading ? 'opacity-50' : ''}`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoEditor;