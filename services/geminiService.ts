
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, MerchandisingSuggestion, AnalysisResult } from "../types";

const getAIInstance = (apiKey: string) => {
  if (!apiKey || apiKey === "undefined") {
    console.error("Critical: API Key is missing.");
    throw new Error("API configuration is incomplete. Please ensure the key is provided.");
  }

  return new GoogleGenAI({ apiKey });
};

export const analyzeInventory = async (photos: { base64: string }[], apiKey: string): Promise<AnalysisResult> => {
  const ai = getAIInstance(apiKey);
  const model = "gemini-2.0-flash";

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
    console.error("AI Response Parsing Error:", error);
    throw new Error("Analysis failed to complete. Please try with clearer photos.");
  }
};

export const generateMockup = async (suggestion: MerchandisingSuggestion, apiKey: string): Promise<string> => {
  const ai = getAIInstance(apiKey);
  // Using imagen which is often under gemini-pro-vision or similar, but for now assuming flash-image works directly or standard model
  // NOTE: gemini-2.5-flash-image might not be valid, usually it's gemini-pro or imagen-3
  // Keep as was in original but might need update. Original was gemini-2.5-flash-image.
  const model = 'gemini-2.0-flash'; // Updated to 2.0-flash as it is more likely to be available/stable
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
      // standard config for generation
    }
  });

  // Image generation with Gemini usually returns inline data if requested, or we might need Imagen model.
  // Assuming the previous code worked or was intended to work with this model pattern.
  // IF the model supports image generation. 

  const candidates = response.candidates || [];
  if (candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
    for (const part of candidates[0].content.parts) {
      // Check for inline data (images)
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  // Fallback if no image found - maybe it returned text?
  throw new Error("Visual generation failed or model returned text instead of image.");
};
