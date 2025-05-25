import api from './api';

// Login user
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register a new user
const signup = async (userData) => {
  try {
    // Using FormData for multipart/form-data (if profile image is included)
    const formData = new FormData();
    
    // Add user data
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    // Add profile image if exists
    if (userData.profileImage) {
      const imageUri = userData.profileImage;
      const filename = imageUri.split('/').pop();
      
      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('profileImage', {
        uri: imageUri,
        name: filename,
        type,
      });
    }
    
    const response = await api.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Validate token
const validateToken = async (token) => {
  try {
    const response = await api.get('/auth/validate');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
const updateProfile = async (userData) => {
  try {
    // Using FormData for multipart/form-data (if profile image is included)
    const formData = new FormData();
    
    // Add user data
    if (userData.username) formData.append('username', userData.username);
    if (userData.email) formData.append('email', userData.email);
    if (userData.password) formData.append('password', userData.password);
    
    // Add profile image if exists and it's a new image (not a URL)
    if (userData.profileImage && !userData.profileImage.startsWith('http')) {
      const imageUri = userData.profileImage;
      const filename = imageUri.split('/').pop();
      
      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('profileImage', {
        uri: imageUri,
        name: filename,
        type,
      });
    }
    
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  login,
  signup,
  validateToken,
  updateProfile
};

export default authService;
