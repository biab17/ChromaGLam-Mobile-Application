const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'google_cloud_key.json'),
  projectId: "gen-lang-client-0450437009"
});

const bucket = storage.bucket('chromaglam_wardrobe'); 

const uploadImage = async (file) => {
  const gcsFileName = `items/${Date.now()}-${file.originalname}`;
  const blob = bucket.file(gcsFileName);

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadImage };