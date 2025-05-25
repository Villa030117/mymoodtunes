import { VALIDATION } from './constants';

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (password) => {
  return password && password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

// Validate username format and length
export const isValidUsername = (username) => {
  return (
    username &&
    username.trim().length > 0 &&
    username.length <= VALIDATION.MAX_USERNAME_LENGTH
  );
};

// Validate playlist name
export const isValidPlaylistName = (name) => {
  return name && name.trim().length > 0;
};

// Validate music file
export const isValidMusicFile = (file) => {
  if (!file) return false;
  
  // Check file type
  const isValidType = VALIDATION.ALLOWED_AUDIO_TYPES.includes(file.type);
  
  // Check file size
  const isValidSize = file.size <= VALIDATION.MAX_FILE_SIZE;
  
  return isValidType && isValidSize;
};

// Validate image file
export const isValidImageFile = (file) => {
  if (!file) return false;
  
  // Check file type
  const isValidType = VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type);
  
  // Check file size
  const isValidSize = file.size <= VALIDATION.MAX_FILE_SIZE;
  
  return isValidType && isValidSize;
};

// Form validation helpers
export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSignupForm = (data) => {
  const errors = {};
  
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (!isValidUsername(data.username)) {
    errors.username = `Username must be between 1 and ${VALIDATION.MAX_USERNAME_LENGTH} characters`;
  }
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(data.password)) {
    errors.password = `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
  }
  
  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAddMusicForm = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  if (!data.artist || data.artist.trim() === '') {
    errors.artist = 'Artist is required';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.audioFile) {
    errors.audioFile = 'Audio file is required';
  } else if (!isValidMusicFile(data.audioFile)) {
    errors.audioFile = 'Audio file must be MP3 or WAV and under 10MB';
  }
  
  if (!data.coverImage) {
    errors.coverImage = 'Cover image is required';
  } else if (!isValidImageFile(data.coverImage)) {
    errors.coverImage = 'Cover image must be JPG or PNG and under 10MB';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCreatePlaylistForm = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Playlist name is required';
  }
  
  if (!data.image) {
    errors.image = 'Playlist image is required';
  } else if (!isValidImageFile(data.image)) {
    errors.image = 'Playlist image must be JPG or PNG and under 10MB';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};