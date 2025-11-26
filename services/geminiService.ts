import { GoogleGenAI } from "@google/genai";

// Retrieve API Key safely for both Node/Webpack (process.env) and Vite (import.meta.env) environments
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Safe check for Vite environment
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore error if import.meta is not available
  }
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateAsciiArt = async (text: string): Promise<string> => {
  if (!text.trim()) return '';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a creative ASCII art representation of the text: "${text}". 
      Return ONLY the ASCII art inside a code block. Do not add markdown backticks like \`\`\`. 
      Keep it compatible with standard monospaced fonts.`,
    });
    
    // Clean up potential markdown formatting if the model disobeys slightly
    let output = response.text || '';
    output = output.replace(/^```(plaintext|ascii)?\n/i, '').replace(/\n```$/, '');
    return output;
  } catch (error) {
    console.error("Gemini ASCII Generation Error:", error);
    return "Error generating ASCII Art. Please check API Key or try again.";
  }
};

export const generateJavaBean = async (jsonString: string, className: string = "Root"): Promise<string> => {
  // Use algorithmic local generation instead of AI as per previous request to ensure determinism
  // This function is kept for backward compatibility signature but redirects to error or could call local logic if imported.
  // Ideally, consumers should call utils/toolLogic directly.
  return "// Please use the Local Logic version in utils/toolLogic.ts"; 
};