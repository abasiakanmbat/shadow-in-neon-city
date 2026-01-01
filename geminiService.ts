
import { GoogleGenAI } from "@google/genai";

export async function getDetectiveHint(narration: string, stats: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are the "Internal Monologue" of a gritty noir detective.
    Current scene narration: "${narration}"
    Current Stats: Logic: ${stats.logic}, Intuition: ${stats.intuition}, Charisma: ${stats.charisma}, Reputation: ${stats.reputation}.
    
    Provide a short (2-3 sentence) hunch in a noir style. 
    Mention how one of their stats might help or hinder them.
    Stay in character. Be cynical, tired, but sharp.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "Something doesn't feel right, but your brain is as foggy as the city streets.";
  }
}

export async function generateSceneVisual(narration: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';

  const prompt = `
    Anime movie scene, high-quality cinematic anime noir style. 
    Setting: Futuristic Neon City, dark, rainy, glowing neon signs, deep shadows.
    Action: ${narration}
    Aesthetic: Cyberpunk, moody lighting, 1990s high-budget anime film look (like Ghost in the Shell or Akira).
  `;

  try {
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

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
