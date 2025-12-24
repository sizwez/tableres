
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRestaurantRecommendations = async (query: string, location?: { lat: number, lng: number }) => {
  const ai = getAI();
  const prompt = `You are an expert South African food critic and concierge.
  The user is asking: "${query}"
  Location Context: ${location ? `Latitude ${location.lat}, Longitude ${location.lng}` : 'Unknown'}
  
  Recommend 3-4 specific restaurant types or styles that fit their request within the South African context. 
  Be specific and helpful. Return the response in a structured JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  vibe: { type: Type.STRING },
                  typicalSpend: { type: Type.STRING }
                },
                required: ["title", "description", "vibe", "typicalSpend"]
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["recommendations", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return null;
  }
};

export const getSmartSearch = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the top-rated restaurants or dining deals in South Africa for: "${query}". Provide a summary and list specific names.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    // Extracting text and grounding sources
    const text = response.text || "No results found.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })) || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini search error:", error);
    return null;
  }
};
