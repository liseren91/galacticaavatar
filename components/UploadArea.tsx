import React, { useRef } from 'react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
        disabled 
          ? 'border-gray-700 bg-gray-900/50 cursor-not-allowed opacity-50' 
          : 'border-sw-yellow/50 bg-gray-900/30 hover:border-sw-yellow hover:bg-gray-900/60 cursor-pointer'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <div>
          <p className="text-xl font-medium text-gray-200">Перетащите фото сюда</p>
          <p className="text-sm text-gray-500 mt-1">или нажмите для выбора (макс 10 за раз)</p>
        </div>
        {disabled && <p className="text-sw-yellow animate-pulse">Идет обработка...</p>}
      </div>
    </div>
  );
};
