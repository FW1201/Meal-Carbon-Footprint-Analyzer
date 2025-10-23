
import { GoogleGenAI, Type } from "@google/genai";
import type { CarbonFootprintReport } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const base64Data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
};

export const analyzeImageForCarbonFootprint = async (imageFile: File): Promise<CarbonFootprintReport> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `請你根據這張圖片，辨識出這道菜餚。然後，列出可能的食材，估計每種食材的重量（以克為單位），並根據公開數據估算每種食材的碳足跡（單位為公斤二氧化碳當量 CO2e）。最後，計算總碳足跡，並提供一份簡短的分析報告。請以 JSON 格式回傳結果。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            imagePart,
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING, description: "菜餚的名稱" },
            totalCarbonFootprint: { type: Type.NUMBER, description: "總碳足跡 (kg CO2e)" },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "食材名稱" },
                  amount: { type: Type.STRING, description: "食材份量 (例如: 100g)" },
                  carbonFootprint: { type: Type.NUMBER, description: "該食材的碳足跡 (kg CO2e)" },
                },
                required: ["name", "amount", "carbonFootprint"],
              },
            },
            summary: { type: Type.STRING, description: "一份關於碳足跡的簡短分析報告" },
          },
          required: ["dishName", "totalCarbonFootprint", "ingredients", "summary"],
        },
      },
    });

    const jsonText = response.text.trim();
    const reportData = JSON.parse(jsonText);
    return reportData as CarbonFootprintReport;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("無法分析圖片。請稍後再試。");
  }
};
