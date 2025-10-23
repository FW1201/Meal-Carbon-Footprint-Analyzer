
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-t-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-green-800 font-semibold">分析中，請稍候...</p>
    </div>
  );
};

export default LoadingSpinner;
