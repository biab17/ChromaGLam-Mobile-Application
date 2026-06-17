const { GoogleGenAI } = require("@google/genai");
const { uploadImage } = require('../../config/cloudStorage');
const itemService = require('../../business/services/itemService');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.addItem = async (req, res) => {
    try {
        // Input validation (presentation layer)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: No user found in request" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // External service calls (controller handles these)
        const imageURL = await uploadImage(req.file);
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString("base64") } },
                { text: `Return ONLY JSON: {"name":"nume","description":"descriere","style":"Casual/Elegant/Sport","colors":"culori","season":"Summer/Winter/All","thermalLevel":"Thin/Medium/Warm","fit":"Slim/Regular/Oversized"}` }
            ],
        });

        // Parse AI response
        const aiData = JSON.parse(result.text.replace(/```json|```/g, "").trim());

        // Call service with clean data
        const newItem = await itemService.addItem(aiData, imageURL, req.user.id);
        
        res.status(201).json(newItem); 
    } catch (error) {
        console.error("Error adding item:", error.message);
        res.status(500).json({ error: "Item attribution failed" });
    }
};



exports.getUserItems = async (req, res) => {
    try {
        const items = await itemService.getUserItems(req.user.id);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
};

exports.toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        const updated = await itemService.toggleAvailability(parseInt(id), available);
        res.status(200).json(updated);
    } catch (error) {
     console.error("Error toggling availability:", error.message);
        res.status(500).json({ error: "Could not upgrade the status of the item." });
    }
};


exports.getItemsToValidate = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const items = await itemService.getItemsForValidation(userId);
        return res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error.message);
        res.status(500).json({ error: "Could not fetch items for validation." });
    }
};

exports.makeItemsAvailable = async (req, res) => {
    try {
        const { itemIds } = req.params;
        const updatedItems = await itemService.makeItemAvailable(parseInt(itemIds));
        return res.status(200).json({
            success: true,
            message: "Item is now available in the closet.",
            item: updatedItems
        });
    } catch (error) {
        console.error("Error updating item availability:", error.message);
        res.status(500).json({ error: "Could not update item availability." });
    }
}

exports.getRecentlyAddedItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const recentlyAddedItems = await itemService.getRecentlyAddedItems(userId);
        return res.status(200).json(recentlyAddedItems);       
    }catch (error) {
        console.error("Error fetching recently added items:", error.message);
        res.status(500).json({ error: "Could not fetch recently added items." });
    }  
};