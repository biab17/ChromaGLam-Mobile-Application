const itemRepository = require('../../data/repositories/itemRepository');
const preferenceRepository = require('../../data/repositories/preferenceRepository');
const aiService = require('./aiService');

exports.generateOutfitSuggestions = async (userId, weather) => {
    // Fetch user's available items
    const items = await itemRepository.getAvailableItems(userId);
    
    // Fetch user's preferences
    const preferences = await preferenceRepository.getPreferencesByUserId(userId);

    // Validate data exists
    if (!items || items.length === 0) {
        throw new Error("No items available in wardrobe");
    }

    if (!preferences) {
        throw new Error("User preferences not configured");
    }

    // Call AI service to generate outfits
    const aiResponse = await aiService.generateOutfits(items, preferences, weather);

    return aiResponse;
};
