import React, { useState, useCallback } from 'react';
import { Hero } from './components/Hero';
import { UploadArea } from './components/UploadArea';
import { ResultCard } from './components/ResultCard';
import { ProcessedItem, CharacterRole } from './types';
import { generateCharacterImage } from './services/geminiService';

const App: React.FC = () => {
  const [items, setItems] = useState<ProcessedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CharacterRole>(CharacterRole.JEDI);

  // Helper to create unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFilesSelected = useCallback((files: File[]) => {
    // Limit to 10 files total for this batch for better UX/API limits
    const remainingSlots = 60 - items.length; // Hard upper limit logic if needed, but per request user loads 10.
    const filesToProcess = files.slice(0, 10); 

    const newItems: ProcessedItem[] = filesToProcess.map(file => ({
      id: generateId(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      characterRole: selectedRole
    }));

    setItems(prev => [...prev, ...newItems]);
  }, [items, selectedRole]);

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const processBatch = async () => {
    if (items.filter(i => i.status === 'pending').length === 0) return;

    setIsProcessing(true);

    // We process sequentially or with small concurrency to avoid hitting rate limits too fast
    // and to provide steady feedback.
    
    // Create a copy to work with
    const queue = [...items];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status !== 'pending') continue;

      // Update status to processing
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'processing' } : p));

      try {
        const resultBase64 = await generateCharacterImage(item.file, item.characterRole || selectedRole);
        
        // Update status to completed
        setItems(prev => prev.map(p => p.id === item.id ? { 
          ...p, 
          status: 'completed', 
          resultUrl: resultBase64 
        } : p));
      } catch (error: any) {
        // Update status to error
        setItems(prev => prev.map(p => p.id === item.id ? { 
          ...p, 
          status: 'error', 
          errorMsg: error.message || 'Unknown error' 
        } : p));
      }
    }

    setIsProcessing(false);
  };

  const handleClearAll = () => {
    if (window.confirm("Очистить все загруженные фото?")) {
      setItems([]);
    }
  };

  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className="min-h-screen pb-20">
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Выберите сторону силы (Персонаж)</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as CharacterRole)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-sw-yellow focus:border-transparent outline-none"
                  disabled={isProcessing}
                >
                  {Object.values(CharacterRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
             </div>
             
             <div className="flex flex-col gap-2">
               <div className="text-sm text-gray-400">
                 Очередь: <span className="text-white">{items.length} фото</span> (Ожидают: {pendingCount})
               </div>
               <div className="flex gap-3">
                 <button
                    onClick={processBatch}
                    disabled={isProcessing || pendingCount === 0}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-black transition-all ${
                      isProcessing || pendingCount === 0 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-sw-yellow hover:bg-yellow-300 shadow-[0_0_15px_rgba(255,232,31,0.3)]'
                    }`}
                 >
                   {isProcessing ? 'Обработка Nano Banana...' : 'Запустить Конвейер Клонов'}
                 </button>
                 
                 {items.length > 0 && !isProcessing && (
                   <button 
                     onClick={handleClearAll}
                     className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10"
                   >
                     Очистить
                   </button>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Upload Area - Hide if processing or if we have items (optional, but good to keep accessible to add more) */}
        {!isProcessing && (
           <div className="mb-12">
             <UploadArea onFilesSelected={handleFilesSelected} disabled={isProcessing} />
           </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ResultCard key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
        </div>
        
      </main>
    </div>
  );
};

export default App;
