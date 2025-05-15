const NewsBox = require("../models/newsBox");

module.exports = {
    getNews: async (req, res) => {
        try {
            const news = await NewsBox.find();
            return res.status(200).json({ news });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    addNews: async (req, res) => {
        try {
            const { title, content } = req.body;
            const news = new NewsBox({
                title,
                content
            });
            await news.save();
            return res.status(201).json({ news });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteNews: async (req, res) => {
        try {
            const { id } = req.params;
            await NewsBox.findByIdAndDelete(id);
            return res.status(200).json({ message: "News deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateNews: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const news = await NewsBox.findByIdAndUpdate(id, { title, content }, { new: true });
            if (!news) {
                return res.status(404).json({ message: "News not found" });
            }
            return res.status(200).json({ message: "News updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
