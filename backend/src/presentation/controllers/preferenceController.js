const { prisma } = require('../../data/prisma/client');

exports.saveOrUpdatePreferences = async (req, res) => {
  try {
    const userId = req.user?.id || parseInt(req.body.userId);

    const preference = await prisma.preference.upsert({
      where: { userId: userId },
      update: {
        style: req.body.style,
        thermalComfort: req.body.thermalComfort,
        height: parseFloat(req.body.height),
        proportions: req.body.proportions,
        preferredColors: req.body.preferredColors,
        avoidedColors: req.body.avoidedColors
      },
      create: {
        style: req.body.style,
        thermalComfort: req.body.thermalComfort,
        height: parseFloat(req.body.height),
        proportions: req.body.proportions,
        preferredColors: req.body.preferredColors,
        avoidedColors: req.body.avoidedColors,
        userId: userId
      }
    });
    res.status(200).json(preference);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not save preferences" });
  }
};