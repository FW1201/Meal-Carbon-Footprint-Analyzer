
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CarbonFootprintReport, Ingredient } from '../types';

interface ResultDisplayProps {
  report: CarbonFootprintReport;
  imagePreviewUrl: string;
}

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM3.823 11.423c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L4.586 15H3a1 1 0 100 2h3a1 1 0 00.707-.293l4-4a1 1 0 00-1.414-1.414L6 14.586l-2.177-2.177zM16.177 8.577c.39.39 1.023.39 1.414 0s.39-1.023 0-1.414L15.414 5H17a1 1 0 100-2h-3a1 1 0 00-.707.293l-4 4a1 1 0 001.414 1.414L14 5.414l2.177 2.177z" />
    </svg>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ report, imagePreviewUrl }) => {
  const chartData = report.ingredients.map(ingredient => ({
    name: ingredient.name,
    '碳足跡 (kg CO2e)': ingredient.carbonFootprint,
  }));

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-2xl space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 tracking-tight">您的餐點碳足跡分析報告</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <img src={imagePreviewUrl} alt="Analyzed meal" className="w-full h-auto object-cover rounded-xl shadow-lg" />
          <h3 className="text-2xl font-semibold text-center text-gray-700">{report.dishName}</h3>
        </div>
        
        <div className="flex flex-col items-center justify-center bg-green-50 p-6 rounded-xl border border-green-200 shadow-inner">
          <p className="text-lg text-gray-600 mb-2">總碳足跡</p>
          <p className="text-6xl font-extrabold text-green-600 tracking-tight">{report.totalCarbonFootprint.toFixed(2)}</p>
          <p className="text-lg text-gray-500">kg CO2e</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-4">成分碳足跡分佈</h4>
          <div className="w-full h-80 bg-gray-50 p-4 rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} style={{ fontSize: '0.8rem' }} />
                <YAxis />
                <Tooltip wrapperClassName="rounded-md shadow-lg" />
                <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
                <Bar dataKey="碳足跡 (kg CO2e)" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-4">詳細報告</h4>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <p className="text-gray-600 leading-relaxed">{report.summary}</p>
            <ul className="space-y-2">
                {report.ingredients.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <LeafIcon />
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="ml-2 text-sm text-gray-500">({item.amount})</span>
                        </div>
                        <span className="font-semibold text-green-700">{item.carbonFootprint.toFixed(3)} kg CO2e</span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
