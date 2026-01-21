const { GoogleGenAI } = require("@google/genai");
const { uploadImage } = require('../../config/cloudStorage');
const itemRepository = require('../../data/repositories/itemRepository');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.addItem = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: No user found in request" });
        }

        const userId = req.user.id;
        if (!req.file) return res.status(400).json({ error: "Missing image" });

        const imageURL = await uploadImage(req.file);

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString("base64") } },
                { text: `Return ONLY JSON: {"name":"nume","description":"descriere","style":"Casual/Elegant/Sport","colors":"culori","season":"Summer/Winter/All","thermalLevel":"Thin/Medium/Warm","fit":"Slim/Regular/Oversized"}` }
            ],
        });

        const aiData = JSON.parse(result.text.replace(/```json|```/g, "").trim());

        await itemRepository.createItem({
            ...aiData,
            imageURL,
            userId: userId 
        });

        res.status(201).send(); 
    } catch (error) {
        console.error("Auth/Processing Error:", error.message);
        res.status(500).json({ error: "Item attribution failed" });
    }
};



exports.getUserItems = async (req, res) => {
    try {
        const items = await itemRepository.getItemsByUserId(req.user.id);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
};

exports.toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        const updated = await itemRepository.updateItemAvailability(parseInt(id), available);
        res.status(200).json(updated);
    } catch (error) {
     console.error("Eroare la toggle:", error.message);
        res.status(500).json({ error: "Could not upgrade the status of the item." });
    }
};