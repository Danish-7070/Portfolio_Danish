const jwt = require('jsonwebtoken');
require('dotenv').config();
const Admin = require('../models/admin');

const authMiddlewares = {
    verifyAdmin: async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            // console.log(req.headers);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await Admin.findById(decoded.id);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            req.admin = admin;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = authMiddlewares;

