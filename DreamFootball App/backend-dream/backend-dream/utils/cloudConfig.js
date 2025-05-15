const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const streamifier = require('streamifier');


console.log('Checking Cloudinary credentials:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME );
console.log('API Key:', process.env.CLOUDINARY_API_KEY );
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET );

// cloudinary.api.ping()
//   .then(result => console.log('Cloudinary connection successful:', result))
//   .catch(error => console.error('Cloudinary connection failed:', error));
  
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: '_DEV',
      allowedFormats: ['png', 'jpg','jpeg'],
    },
  });


  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: "_DEV", resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

  module.exports = {
    cloudinary,
    storage,
    uploadToCloudinary
  };