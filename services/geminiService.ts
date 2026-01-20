
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, MerchandisingSuggestion, AnalysisResult } from "../types";

export const analyzeInventory = async (photos: { base64: string }[]): Promise<AnalysisResult> => {
  // Create instance right before use to ensure up-to-date environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const imageParts = photos.map(photo => ({
    inlineData: {
      data: photo.base64.split(',')[1],
      mimeType: "image/jpeg"
    }
  }));

  const systemInstruction = `
    You are an expert inventory auditor for LEIVIP, a B2B clothing retailer. 
    Analyze store shelf/rack photos and extract structured inventory data.
    Categories: tops, bottoms, outerwear, accessories.
    Style tags: casual, formal, athletic, boho, minimal.
    Provide realistic quantity estimates based on visual density.
    Generate visual merchandising suggestions to improve store layout.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...imageParts,
        { text: "Extract inventory data and provide 3-4 specific visual merchandising suggestions from these images." }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                color: { type: Type.STRING },
                pattern: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                styleTags: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["category", "color", "quantity"]
            }
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  try {
    const jsonStr = (response.text || "").trim();
    const result = JSON.parse(jsonStr);
    return {
      items: (result.items || []).map((item: any, index: number) => ({
        ...item,
        id: `item-${index}`
      })),
      suggestions: (result.suggestions || []).map((s: any, index: number) => ({
        ...s,
        id: `sug-${index}`
      }))
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Analysis failed. Please try with clearer photos.");
  }
};

export const generateMockup = async (suggestion: MerchandisingSuggestion): Promise<string> => {
  // Create instance right before use
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';
  const prompt = `A professional high-quality 3D render of a retail clothing store display for a high-end brand. 
  The display shows: ${suggestion.title}. 
  Visual details: ${suggestion.description}. 
  Setting: Minimalist, clean lighting, focus on garment organization and color story. 
  No people in the shot, just the merchandising display.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image mockup.");
};
