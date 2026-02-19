
import { GoogleGenAI, Type } from "@google/genai";
import { WardrobeItem, EventDetails, OutfitSuggestion, SkinProfile, BodyProfile } from "../types";

export const analyzeSkinTone = async (base64Image: string): Promise<SkinProfile> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: 'Perform a professional skin tone mapping for fashion coordination. Analyze the HSV and LAB color spaces. Return JSON with: detectedTone, hex, undertone (Warm/Cool/Neutral), and labValues (l, a, b).' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedTone: { type: Type.STRING },
          hex: { type: Type.STRING },
          undertone: { type: Type.STRING },
          labValues: {
            type: Type.OBJECT,
            properties: {
              l: { type: Type.NUMBER },
              a: { type: Type.NUMBER },
              b: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeGarment = async (base64Image: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: 'Analyze this garment for a high-end fashion vault. Identify category, precise color, and style. If Indian Ethnic, detect regional heritage (e.g. Lucknawi, Banarasi, Kanjeevaram). Return JSON.' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          color: { type: Type.STRING },
          style: { type: Type.STRING },
          brand: { type: Type.STRING },
          isEthnic: { type: Type.BOOLEAN },
          region: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const planPersonalizedOutfit = async (
  event: EventDetails,
  wardrobe: WardrobeItem[],
  skin: SkinProfile,
  body: BodyProfile,
  history: any[]
): Promise<OutfitSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const wardrobeContext = wardrobe.map(i => `${i.category} (${i.brand}, ${i.color}, ${i.region || 'Western'})`).join(', ');
  
  const prompt = `Act as a Premier Fashion Architect for both Male and Female designers.
  Profile: Gender ${event.gender}, Skin ${skin.detectedTone} (${skin.undertone}), Body ${body.type}.
  Event: ${event.title}, Context: ${event.stateContext || 'Global'}.
  System: ${event.type}. Mood: ${event.moodGoal}.
  Wardrobe: ${wardrobeContext}
  
  Task: Propose 3 detailed designer looks.
  Include:
  1. Main garment coordination (Indian regional specific if Ethnic selected).
  2. Footwear coordination (e.g., Juttis, Kolhapuris, Oxfords, stilettos).
  3. Accessories (Jewelry, Watches, Belts, Turbans/Dupattas).
  4. Color Palette matching skin resonance.
  5. Designer inspiration (e.g. Sabyasachi, Manish Malhotra, Giorgio Armani).
  
  Return JSON array of OutfitSuggestion objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            designerInspiration: { type: Type.STRING },
            culturalSignificance: { type: Type.STRING },
            footwear: { type: Type.STRING },
            accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedBrands: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  link: { type: Type.STRING }
                }
              }
            },
            suitabilityScore: { type: Type.NUMBER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                confidence: { type: Type.NUMBER },
                comfort: { type: Type.NUMBER },
                socialImpact: { type: Type.NUMBER },
                skinResonance: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });

  const raw = JSON.parse(response.text || '[]');
  return raw.map((s: any, idx: number) => ({
    ...s,
    id: `personalized-${Date.now()}-${idx}`,
    visualPreviews: []
  }));
};

export const generateOutfitVisual = async (prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: `High-end luxury fashion catalog photography. A full-body shot of a designer outfit: ${prompt}. Cinematic lighting, intricate textures, including coordinated footwear and accessories. 8k resolution, elegant composition.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
        imageSize: "1K"
      }
    }
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};
