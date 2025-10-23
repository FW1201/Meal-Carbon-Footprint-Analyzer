
import React, { useState, useCallback, useRef } from 'react';
import { analyzeImageForCarbonFootprint } from './services/geminiService';
import type { CarbonFootprintReport } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ResultDisplay from './components/ResultDisplay';

const UploadIcon = () => (
  <svg className="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CarbonFootprintReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("請先選擇一張圖片。");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeImageForCarbonFootprint(imageFile);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤。");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-green-50/50 font-sans text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 tracking-tight">
          餐點碳足跡分析
        </h1>
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
          上傳您的餐點照片，讓我們用 AI 為您分析其對環境的影響。
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300">
          {!analysisResult && (
            <div className="space-y-6">
              <div
                onClick={triggerFileSelect}
                className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-green-400 transition-colors"
              >
                <div className="space-y-2 text-center">
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Meal preview" className="mx-auto h-48 w-auto object-contain rounded-md" />
                  ) : (
                    <>
                      <UploadIcon />
                      <div className="flex text-sm text-gray-600">
                        <span className="relative bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                          <span>上傳檔案</span>
                        </span>
                        <p className="pl-1">或拖曳至此</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
              </div>

              {imageFile && !isLoading && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                          onClick={handleAnalyzeClick}
                          disabled={isLoading}
                          className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                          {isLoading ? '分析中...' : '開始分析'}
                      </button>
                      <button
                          onClick={handleReset}
                          className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform"
                      >
                          重新選擇
                      </button>
                  </div>
              )}
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          
          {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}

          {analysisResult && imagePreviewUrl && (
            <div className="animate-fade-in">
              <ResultDisplay report={analysisResult} imagePreviewUrl={imagePreviewUrl} />
              <div className="text-center mt-8">
                  <button
                      onClick={handleReset}
                      className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                  >
                      分析另一張照片
                  </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} 碳足跡分析器. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;

