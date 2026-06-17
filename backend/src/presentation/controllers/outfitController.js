const outfitService = require('../../business/services/outfitService');

exports.getOutfitSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weather } = req.body;

    // Validate input
    if (!weather) {
      return res.status(400).json({ error: "Weather data is required" });
    }

    // Call service to generate outfit suggestions
    const aiResponse = await outfitService.generateOutfitSuggestions(userId, weather);

    res.status(200).json(aiResponse);

  } catch (error) {
    console.error("Outfit Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};