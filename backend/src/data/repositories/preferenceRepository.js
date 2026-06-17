const { prisma } = require('../prisma/client');

class PreferenceRepository {
    async createPreference(data) {
        return await prisma.preference.create({
            data: {
                style: data.style,
                preferredColors: data.preferredColors,
                avoidedColors: data.avoidedColors,
                thermalComfort: data.thermalComfort,
                height: parseFloat(data.height),
                proportions: data.proportions,
                userId: parseInt(data.userId)
            }
        });
    }

    async getPreferencesByUserId(userId) {
        return await prisma.preference.findUnique({
            where: { userId: userId }
        });
    }
}

module.exports = new PreferenceRepository();