const itemRepository = require('../../data/repositories/itemRepository');

// Service method - receives already-processed data (AI analysis + image URL already done)
exports.addItem = async (itemData, imageURL, userId) => {
    if (!itemData || !imageURL || !userId) {
        throw new Error("Missing required item data");
    }

    return await itemRepository.createItem({
        ...itemData,
        imageURL,
        userId,
        available: true
    });
};

exports.getUserItems = async (userId) => {
    return await itemRepository.getItemsByUserId(userId);
};

exports.toggleAvailability = async (itemId, status) => {
    return await itemRepository.updateItemAvailability(itemId, status);
};

exports.getItemsForValidation = async (userId) => {
    const days = new Date();
    days.setDate(days.getDate() - 3);

    return await itemRepository.getUnavailableItemsOlderThan(userId, days);
};

exports.makeItemAvailable = async (itemId) => {
    return await itemRepository.updateItemAvailability(itemId, true);
};

exports.getRecentlyAddedItems = async (userId, limit = 5) => {
    const recentlyAddedItems = await itemRepository.getRecentlyAddedItems(userId, limit);

    return {
        recentlyAddedItems: recentlyAddedItems
    };
};