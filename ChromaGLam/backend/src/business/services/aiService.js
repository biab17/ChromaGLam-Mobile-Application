const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateOutfits = async (items, preferences, weather) => {
    const availableIds = items.map(i => i.item_id).join(', ');

    const prompt = `
    System Context: You are a professional fashion stylist. Your goal is to curate two distinct outfits using ONLY the item IDs provided from the user's wardrobe.

    Input Data:
    - Weather: ${weather.temp}°C, ${weather.description}
    - User Style: ${preferences.style}
    - Preferred Colors: ${preferences.preferredColors.join(', ')}
    - Avoided Colors: ${preferences.avoidedColors.join(', ')}
    - Thermal Comfort Level: ${preferences.thermalComfort}

    User Wardrobe (List of Available IDs):
    ${items.map(i => `ID [${i.item_id}]: ${i.name} (Style: ${i.style}, Color: ${i.colors}, Thermal: ${i.thermalLevel})`).join('\n')}

    Rules for Selection:
    1. Thermal Accuracy: Since it is ${weather.temp}°C, prioritize items with a "thermalLevel" that ensures comfort (e.g., "Warm" or "Medium" for cold weather, "Thin" for heat).
    2. Strict Constraint: NEVER use an item ID if its color is in the "Avoided Colors" list.
    3. Cohesion: Each outfit must be a complete, wearable set (e.g., a top and a bottom, or a dress and a jacket).
    4. Style Matching: All selected IDs in an outfit should complement the user's "${preferences.style}" preference.

    Output Requirement:
    Return ONLY a raw JSON object. Do not include markdown tags, backticks, or any explanatory text. Use the following structure:
    {
      "option1": [number, number, number],
      "option2": [number, number, number]
    }
    `;

    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ text: prompt }]
    });

    const cleanJson = result.text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
};