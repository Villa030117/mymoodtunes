const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

createDirIfNotExists('./uploads/images');
createDirIfNotExists('./uploads/music');

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// Configure storage for audio files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/music');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'music-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// File filter for audio
const audioFileFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|ogg|m4a/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('audio/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'));
  }
};

// Set up multer for image uploads
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
  fileFilter: imageFileFilter
});

// Set up multer for audio uploads
const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max size
  fileFilter: audioFileFilter
});

// Handle music uploads (both audio and cover image)
const uploadMusic = (req, res, next) => {
  const uploadCover = uploadImage.single('cover_image');
  
  uploadCover(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        message: `Cover image upload error: ${err.message}` 
      });
    }

    const uploadAudioFile = uploadAudio.single('audio_file');
    
    uploadAudioFile(req, res, (err) => {
      if (err) {
        // Remove the uploaded cover image if audio upload fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({ 
          success: false, 
          message: `Audio upload error: ${err.message}` 
        });
      }
      
      next();
    });
  });
};

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      message: `Upload error: ${err.message}` 
    });
  } else if (err) {
    return res.status(500).json({ 
      success: false, 
      message: `Server error during upload: ${err.message}` 
    });
  }
  next();
};

module.exports = {
  uploadImage: uploadImage.single('image'),
  uploadAudio: uploadAudio.single('audio_file'),
  uploadMusic,
  handleMulterError
};
