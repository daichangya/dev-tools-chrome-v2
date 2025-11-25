import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a real Chrome Extension, keys might be stored in sync storage. 
// Here we assume environment availability as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  if (!jsonString.trim()) return '';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Convert the following JSON into a valid Java Bean (POJO) class structure.
      Root class name: ${className}.
      Includes getters, setters, and toString().
      Use private fields.
      Handle nested objects by creating inner static classes or appropriate structure.
      
      JSON:
      ${jsonString}
      
      Return ONLY the Java code. Do not include markdown backticks.`,
    });

    let output = response.text || '';
    output = output.replace(/^```java\n/i, '').replace(/\n```$/, '');
    return output;
  } catch (error) {
    console.error("Gemini JavaBean Generation Error:", error);
    return "// Error generating Java Code. Ensure valid JSON input.";
  }
};