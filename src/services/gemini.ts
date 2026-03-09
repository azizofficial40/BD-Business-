import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getBusinessInsights = async (businessData: any, prompt?: string) => {
  try {
    const context = `Context: This is an e-commerce management system. Business Data: ${JSON.stringify(businessData)}.`;
    const userPrompt = prompt ? `User Query: ${prompt}` : "Analyze this business data and provide 3 actionable insights for growth.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${context}\n\n${userPrompt}`,
      config: {
        systemInstruction: "You are a professional business consultant. Provide concise, high-impact advice in Bengali and English mixed (Hinglish/Bengali style). Be friendly and encouraging.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights are currently unavailable. Please try again later.";
  }
};
