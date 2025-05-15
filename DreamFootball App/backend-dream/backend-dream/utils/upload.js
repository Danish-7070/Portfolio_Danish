const multer = require("multer");
const { uploadToCloudinary } = require("../utils/cloudConfig"); // Import Cloudinary upload function

const storage = multer.memoryStorage(); // Store file in memory before uploading to Cloudinary

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
    },
}).single("image");

// Middleware to handle image upload and upload to Cloudinary
const handleUpload = async (req, res, next) => {
    upload(req, res, async (err) => {
        // console.log("Request file:", req.file);
        console.log("request method:", req.method);
        if(req.method === "PUT" && !req.file) {
            return next();
        }
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            console.log("File upload successful");
            console.log("Uploaded file:", );

            // Upload file to Cloudinary
            const result = await uploadToCloudinary(req.file);
            console.log("Cloudinary Upload Result:", );

            // Attach Cloudinary details to request object
            req.file.cloudinaryData = {
                url: result.secure_url,
                filename: result.public_id, // Store Cloudinary's public_id
            };

            console.log("Cloudinary data:", req.file.cloudinaryData);

            next();
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }
    });
};

module.exports = { upload, handleUpload };
