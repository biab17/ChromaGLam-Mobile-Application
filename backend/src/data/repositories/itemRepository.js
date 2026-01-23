const { prisma } = require('../prisma/client');

class ItemRepository {
    async createItem(data) {
        return await prisma.item.create({
            data: {
                name: data.name,
                description: data.description,
                style: data.style,
                colors: data.colors,
                season: data.season,
                thermalLevel: data.thermalLevel,
                fit: data.fit,
                available:data.available,
                imageURL: data.imageURL,
                userId: data.userId
            }
        });
    }

    async getItemsByUserId(userId) {
        return await prisma.item.findMany({
            where: { userId: userId }
        });
    }

    async updateItemAvailability(itemId, status) {
        return await prisma.item.update({
            where: { item_id: itemId },
            data: { available: status }
        });
    }
}

module.exports = new ItemRepository();