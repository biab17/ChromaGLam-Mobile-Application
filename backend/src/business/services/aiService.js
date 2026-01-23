const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateOutfits = async (items, preferences, weather) => {

    const prompt = `
    System Context: You are a professional fashion stylist. Your goal is to curate two distinct outfits using ONLY the item IDs provided from the user's wardrobe.
    Input Data:
    - Weather: ${weather.temp}°C, ${weather.description}
    - User Style: ${preferences.style}
    - User Wardrobe (List of Available IDs):
    ${items.map(i => `ID [${i.item_id}]: ${i.name} (Style: ${i.style}, Color: ${i.colors})`).join('\n')}

    Output Requirement:
    Return ONLY a raw JSON object. Use this structure:
    {
      "option1": [number, number, number],
      "option2": [number, number, number]
    }
    `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview", 
            contents: [{ text: prompt }]
        });

        if (!result || !result.text) {
            throw new Error("AI no response.");
        }

        const cleanJson = result.text.replace(/```json|```/g, "").trim();
        const recommendation = JSON.parse(cleanJson);

        const outfit1 = recommendation.option1
            .map(id => items.find(item => String(item.item_id) === String(id)))
            .filter(Boolean);

        const outfit2 = recommendation.option2
            .map(id => items.find(item => String(item.item_id) === String(id)))
            .filter(Boolean);
        
        return { outfit1, outfit2 };

    } catch (err) {
        console.error("DEBUG OUTFITS ERROR:", err.message); 
        return { outfit1: [], outfit2: [] }; 
    }
};