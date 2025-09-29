import React, { useRef, useState } from 'react';
import Button from './Button';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    currentImage?: string;
    className?: string;
    accept?: string;
}

export default function ImageUpload({ 
    onImageSelect, 
    currentImage, 
    className = "",
    accept = "image/*"
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            
            // Call parent callback
            onImageSelect(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />
            
            {preview ? (
                <div className="space-y-2">
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleButtonClick}
                        >
                            Change Image
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleButtonClick}
                        >
                            Select Image
                        </Button>
                        <p className="mt-2 text-sm text-gray-500">
                            PNG, JPG, GIF up to 2MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}