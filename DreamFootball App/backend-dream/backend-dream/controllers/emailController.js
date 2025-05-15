const Email = require("../models/email");

module.exports = {
  addEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const newEmail = new Email({
        email,
      });
      await newEmail.save();
      return res.status(201).json({ message: "Email added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
};
