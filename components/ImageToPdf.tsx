import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import UploadCloudIcon from './icons/UploadCloudIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ImageFile {
  id: number;
  file: File;
  src: string;
}

const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileChange = (files: FileList) => {
    if (!files || files.length === 0) return;
    setError(null);

    const newImages: ImageFile[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of Array.from(files)) {
      if (!validTypes.includes(file.type)) {
        setError(`Skipping invalid file type: ${file.name}. Please use JPG, PNG, or WEBP.`);
        continue;
      }
      newImages.push({
        id: Date.now() + Math.random(),
        file,
        src: URL.createObjectURL(file),
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  };
  
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    let _images = [...images];
    const draggedItemContent = _images.splice(dragItem.current, 1)[0];
    _images.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImages(_images);
  };
  
  const handleRemoveImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      setError('Please add at least one image.');
      return;
    }
    setIsLoading(true);

    const doc = new jsPDF();
    const addImageToPdf = (imgData: string, width: number, height: number, isFirstPage: boolean) => {
        if (!isFirstPage) doc.addPage();
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / width, pdfHeight / height);
        const imgWidth = width * ratio;
        const imgHeight = height * ratio;
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
    };

    try {
      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        const img = new Image();
        img.src = imageFile.src;
        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context not found'));
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                addImageToPdf(dataUrl, img.width, img.height, i === 0);
                resolve();
            }
            img.onerror = (e) => reject(new Error(`Failed to load image: ${imageFile.file.name}`));
        });
      }
      doc.save('images.pdf');
    } catch(e: any) {
        setError(`An error occurred during PDF creation: ${e.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.src));
    setImages([]);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div 
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-brand-accent dark:hover:border-brand-accent transition-colors mb-6"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag & drop images</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFileChange(e.target.files)}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          multiple
        />
      </div>
      
      {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-4">{error}</p>}

      {images.length > 0 && (
        <>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">You have added {images.length} image(s). Drag and drop to reorder.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {images.map((image, index) => (
                <div 
                    key={image.id}
                    className="relative group bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md aspect-square cursor-grab"
                    draggable
                    onDragStart={() => dragItem.current = index}
                    onDragEnter={() => dragOverItem.current = index}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <img src={image.src} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                    <button onClick={() => handleRemoveImage(image.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={convertToPdf}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Creating PDF...</> : <><DownloadIcon className="w-5 h-5 mr-2" /> Convert to PDF</>}
                </button>
                 <button onClick={handleReset} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Reset
                 </button>
            </div>
        </>
      )}
    </div>
  );
};

export default ImageToPdf;