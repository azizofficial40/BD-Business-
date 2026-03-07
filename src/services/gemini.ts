import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getBusinessInsights = async (businessData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this business data and provide 3 actionable insights for growth: ${JSON.stringify(businessData)}`,
      config: {
        systemInstruction: "You are a professional business consultant. Provide concise, high-impact advice in Bengali and English mixed (Hinglish/Bengali style).",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights are currently unavailable. Please try again later.";
  }
};
