import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 relative overflow-hidden">
      <h1 className="text-5xl md:text-7xl font-bold text-sw-yellow mb-4 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(255, 232, 31, 0.5)' }}>
        Galactic Avatar
      </h1>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
        Превратите свой отдел в Орден Джедаев (или Ситхов).<br />
        <span className="text-sm text-gray-500 mt-2 block">Powered by Gemini Nano Banana</span>
      </p>
    </div>
  );
};
