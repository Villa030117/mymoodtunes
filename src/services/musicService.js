import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage key for music data
const MUSIC_STORAGE_KEY = 'moodtunes_music_data';

// Add path handling helper
const getValidImagePath = (path) => {
  if (!path) return null;
  // Handle file:// prefix for Android
  if (Platform.OS === 'android' && !path.startsWith('file://')) {
    return `file://${path}`;
  }
  return path;
};

// Initialize storage with empty array if no data exists
const initializeStorage = async () => {
  try {
    const existingData = await AsyncStorage.getItem(MUSIC_STORAGE_KEY);
    if (!existingData) {
      // Initialize with empty array instead of sample data
      await AsyncStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(existingData);
  } catch (error) {
    console.error('Error initializing storage:', error);
    return [];
  }
};

// Helper to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const getAllMusic = async () => {
  try {
    const musicData = await AsyncStorage.getItem('music');
    if (musicData) {
      return { data: JSON.parse(musicData) };
    }
    return { data: [] };
  } catch (error) {
    console.error('Error getting music:', error);
    throw error;
  }
};

const addMusic = async (form) => {
  try {
    const existingMusic = await AsyncStorage.getItem('music');
    let musicList = existingMusic ? JSON.parse(existingMusic) : [];
    
    // Create new music object with permanent image storage
    const newMusic = {
      _id: generateId(),
      title: form.get('title'),
      artist: form.get('artist'),
      category: form.get('category'),
      audioFile: form.get('audioFile')?.uri || null,
      coverImage: form.get('coverImage') || null,
      createdAt: new Date().toISOString()
    };

    // Add to end of list instead of beginning
    musicList = [...musicList, newMusic];
    
    // Store in AsyncStorage
    await AsyncStorage.setItem('music', JSON.stringify(musicList));
    
    return { data: newMusic };
  } catch (error) {
    console.error('Error adding music:', error);
    throw error;
  }
};

// Get music by category/mood
const getMusicByCategory = async (category) => {
  try {
    const music = await initializeStorage();
    const filteredMusic = music.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
    
    return {
      data: filteredMusic,
      success: true
    };
  } catch (error) {
    console.error('Error getting music by category:', error);
    throw handleError(error);
  }
};

// Search music by title, artist or mood
const searchMusic = async (query) => {
  try {
    const music = await initializeStorage();
    const searchQuery = query.toLowerCase();
    
    const filteredMusic = music.filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      item.artist.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );
    
    return {
      data: filteredMusic,
      success: true
    };
  } catch (error) {
    console.error('Error searching music:', error);
    throw handleError(error);
  }
};

// Update existing music
const updateMusic = async (id, form) => {
  try {
    const existingMusic = await AsyncStorage.getItem('music');
    let musicList = existingMusic ? JSON.parse(existingMusic) : [];
    
    const index = musicList.findIndex(music => music._id === id);
    if (index === -1) {
      throw new Error('Music not found');
    }

    // Get current music data
    const currentMusic = musicList[index];

    // Create updated music object
    const updatedMusic = {
      ...currentMusic,
      title: form.get('title') || currentMusic.title,
      artist: form.get('artist') || currentMusic.artist,
      category: form.get('category') || currentMusic.category,
      coverImage: form.get('coverImage') || currentMusic.coverImage,
      audioFile: form.get('audioFile')?.uri || currentMusic.audioFile,
      updatedAt: new Date().toISOString()
    };

    // Update the music in the list
    musicList[index] = updatedMusic;

    // Save to AsyncStorage
    await AsyncStorage.setItem('music', JSON.stringify(musicList));

    return { data: updatedMusic };
  } catch (error) {
    console.error('Error updating music:', error);
    throw error;
  }
};

// Delete music
const deleteMusic = async (id) => {
  try {
    // Get music from the correct storage key
    const existingMusic = await AsyncStorage.getItem('music');
    if (!existingMusic) {
      throw new Error('No music data found');
    }

    let musicList = JSON.parse(existingMusic);
    const musicIndex = musicList.findIndex(item => item._id === id);

    if (musicIndex === -1) {
      throw new Error('Music not found');
    }

    // Remove the music from the array
    musicList.splice(musicIndex, 1);
    
    // Save the updated list
    await AsyncStorage.setItem('music', JSON.stringify(musicList));
    
    return {
      success: true,
      message: 'Music deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting music:', error);
    throw {
      message: error.message || 'Failed to delete music',
      status: 500
    };
  }
};

// Get user favorites
const getFavorites = async () => {
  try {
    // Return actual favorites based on a favorites field
    const music = await initializeStorage();
    const favorites = music.filter(item => item.isFavorite === true);
    
    return {
      data: favorites,
      success: true
    };
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw handleError(error);
  }
};

// Add music to favorites
const addToFavorites = async (musicId) => {
  try {
    let music = await initializeStorage();
    const index = music.findIndex(item => item._id === musicId);
    
    if (index !== -1) {
      music[index].isFavorite = true;
      await AsyncStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(music));
    }
    
    return {
      success: true,
      message: 'Added to favorites successfully'
    };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw handleError(error);
  }
};

// Remove music from favorites
const removeFromFavorites = async (musicId) => {
  try {
    let music = await initializeStorage();
    const index = music.findIndex(item => item._id === musicId);
    
    if (index !== -1) {
      music[index].isFavorite = false;
      await AsyncStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(music));
    }
    
    return {
      success: true,
      message: 'Removed from favorites successfully'
    };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw handleError(error);
  }
};

// Error handler
const handleError = (error) => {
  return {
    message: error.message || 'An error occurred',
    status: 500
  };
};

const musicService = {
  getAllMusic,
  getMusicByCategory,
  searchMusic,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  addMusic,
  updateMusic,
  deleteMusic
};

export default musicService;
