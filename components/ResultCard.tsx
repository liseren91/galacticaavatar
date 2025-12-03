import React from 'react';
import { ProcessedItem } from '../types';

interface ResultCardProps {
  item: ProcessedItem;
  onRemove: (id: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item, onRemove }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-3 bg-gray-900 flex justify-between items-center border-b border-gray-700">
        <span className="text-xs text-gray-400 truncate max-w-[150px]">{item.file.name}</span>
        {item.status !== 'processing' && (
          <button 
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="relative p-4 flex-1 flex flex-col items-center justify-center min-h-[300px]">
        
        {/* State: Pending/Processing - Show Source */}
        {(item.status === 'pending' || item.status === 'processing') && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-2">
             <img src={item.previewUrl} alt="Original" className="w-full h-full object-cover opacity-60" />
             
             {item.status === 'processing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sw-yellow mb-2"></div>
                  <span className="text-sw-yellow text-sm font-bold tracking-wider animate-pulse">ГЕНЕРАЦИЯ</span>
                </div>
             )}
          </div>
        )}

        {/* State: Completed - Show Result */}
        {item.status === 'completed' && item.resultUrl && (
          <div className="relative w-full h-full group">
            <img src={item.resultUrl} alt="Result" className="w-full h-auto rounded-lg shadow-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <a 
                 href={item.resultUrl} 
                 download={`starwars_${item.file.name.split('.')[0]}.png`}
                 className="bg-sw-yellow text-black px-4 py-2 rounded font-bold hover:bg-yellow-300 transition-colors"
               >
                 Скачать
               </a>
            </div>
          </div>
        )}

        {/* State: Error */}
        {item.status === 'error' && (
           <div className="flex flex-col items-center justify-center text-center p-4">
             <div className="text-red-500 mb-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <p className="text-sm text-red-400">Ошибка: {item.errorMsg || 'Не удалось обработать'}</p>
           </div>
        )}
      </div>

      <div className="p-2 bg-gray-900 border-t border-gray-700 text-center">
        <span className="text-xs text-sw-yellow uppercase tracking-widest">
           {item.status === 'completed' ? item.characterRole : item.status === 'processing' ? 'Nano Banana работает...' : 'Ожидание'}
        </span>
      </div>
    </div>
  );
};
