//contactController.js
const Contact = require("../models/Contact");

module.exports = {
    getContactForms: async (req, res) => {
        try {
            const contactForms = await Contact.find();
            return res.status(200).json({ contactForms });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    postContactForm: async (req, res) => {
        try {
            const { subject, email, message } = req.body;
            const contactForm = new Contact({
                email,
                subject,
                message
            });
            await contactForm.save();
            return res.status(201).json({ contactForm });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

