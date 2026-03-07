import { GoogleGenAI } from "@google/genai";
import { BusinessState } from "../types";

export const getBusinessInsights = async (
  state: BusinessState,
  prompt: string,
) => {
  const apiKey = state.apiKey || process.env.API_KEY;
  if (!apiKey) {
    return "API Key not found. Please configure it in Settings.";
  }

  // Use correct initialization with named parameter
  const ai = new GoogleGenAI({ apiKey });

  const businessSummary = {
    totalProducts: state.products.length,
    totalSales: state.sales.length,
    totalExpenses: state.expenses.reduce((acc, curr) => acc + curr.amount, 0),
    currentStockValue: state.products.reduce(
      (acc, p) =>
        acc +
        p.purchasePrice * p.variants.reduce((vAcc, v) => vAcc + v.quantity, 0),
      0,
    ),
    lowStockItems: state.products
      .filter((p) => p.variants.some((v) => v.quantity < 5))
      .map((p) => p.name),
    recentSales: state.sales
      .slice(0, 5)
      .map((s) => `${s.quantity}x ${s.productName} for ${s.totalAmount}`),
    totalProfit: state.sales.reduce((acc, s) => acc + s.profit, 0),
  };

  const systemInstruction = `
    You are 'Sylsas Business Assistant', a friendly and expert advisor for Sylsas Fashion, a clothing store.
    Analyze the provided business data and answer the owner's questions in a professional yet encouraging way.
    Use simple business language (সহজ ব্যবসায়িক ভাষা).
    You can reply in both English and Bengali.
    
    Current Business Data:
    ${JSON.stringify(businessSummary, null, 2)}
    
    Guidelines:
    - If the user asks about growth, compare sales vs expenses.
    - If asked about top products, identify them from sales.
    - If asked about stock, mention items in lowStockItems.
    - Provide actionable advice for increasing profit.
  `;

  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning task
    // Added thinkingBudget to allow for more detailed analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    // Access .text property directly as per guidelines
    return response.text || "I'm sorry, I couldn't analyze the data right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI assistant. Please try again later.";
  }
};
