const { prisma } = require('../../data/prisma/client');
const aiService = require('../../business/services/aiService');

exports.getOutfitSuggestions = async (req, res) => {
  try {
    const userIdFromToken = req.user.id; 
    const { weather } = req.body;

    const items = await prisma.item.findMany({
      where: { 
        userId: userIdFromToken, 
        available: true 
      }
    });

    const preferences = await prisma.preference.findUnique({
      where: { userId: userIdFromToken }
    });

    if (!items.length || !preferences) {
      return res.status(400).json({ error: "Not enough data." });
    }

    const aiResponse = await aiService.generateOutfits(items, preferences, weather);

    res.status(200).json(aiResponse);

  } catch (error) {
    console.error("Outfit Error:", error.message);
    res.status(500).json({ error: "Error while generating the outfits." });
  }
};