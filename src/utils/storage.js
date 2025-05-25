import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from './constants';

// Storage key for playlists
const PLAYLISTS_STORAGE_KEY = 'moodtunes_playlists';

// Mock data for playlists
const MOCK_PLAYLISTS = [
  {
    id: '1',
    name: 'Summer Vibes 2025',
    user: { username: 'johndoe' },
    songs: Array(12).fill({}),
    createdAt: '2025-04-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Workout Motivation',
    user: { username: 'fitness_freak' },
    songs: Array(8).fill({}),
    createdAt: '2025-04-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Chill Evening',
    user: { username: 'music_lover' },
    songs: Array(15).fill({}),
    createdAt: '2025-04-13T20:15:00Z'
  },
  {
    id: '4',
    name: 'Morning Coffee',
    user: { username: 'latte_luv' },
    songs: Array(9).fill({}),
    createdAt: '2025-04-12T08:00:00Z'
  },
  {
    id: '5',
    name: 'Late Night Drives',
    user: { username: 'nocturnal_soul' },
    songs: Array(13).fill({}),
    createdAt: '2025-04-11T23:30:00Z'
  },
  {
    id: '6',
    name: 'Top Hits 2025',
    user: { username: 'chart_master' },
    songs: Array(20).fill({}),
    createdAt: '2025-04-10T12:00:00Z'
  },
  {
    id: '7',
    name: 'Indie Breeze',
    user: { username: 'indiefan92' },
    songs: Array(10).fill({}),
    createdAt: '2025-04-09T18:45:00Z'
  },
  {
    id: '8',
    name: 'Throwback Mix',
    user: { username: 'retro_beats' },
    songs: Array(14).fill({}),
    createdAt: '2025-04-08T17:20:00Z'
  },
  {
    id: '9',
    name: 'Coding Flow',
    user: { username: 'devstream' },
    songs: Array(11).fill({}),
    createdAt: '2025-04-07T09:30:00Z'
  },
  {
    id: '10',
    name: 'Rainy Day Loops',
    user: { username: 'lofi_addict' },
    songs: Array(16).fill({}),
    createdAt: '2025-04-06T14:00:00Z'
  },
  {
    id: '11',
    name: 'Friday Party',
    user: { username: 'weekend_warrior' },
    songs: Array(18).fill({}),
    createdAt: '2025-04-05T21:00:00Z'
  },
  {
    id: '12',
    name: 'Focus Mode',
    user: { username: 'zen_master' },
    songs: Array(7).fill({}),
    createdAt: '2025-04-04T10:10:00Z'
  },
  {
    id: '13',
    name: 'Romantic Evenings',
    user: { username: 'heartsync' },
    songs: Array(12).fill({}),
    createdAt: '2025-04-03T19:00:00Z'
  },
  {
    id: '14',
    name: 'Global Beats',
    user: { username: 'wanderlust' },
    songs: Array(15).fill({}),
    createdAt: '2025-04-02T08:50:00Z'
  },
  {
    id: '15',
    name: 'Sunday Chill',
    user: { username: 'mellow_tunes' },
    songs: Array(9).fill({}),
    createdAt: '2025-04-01T12:30:00Z'
  },
  {
    id: '16',
    name: 'Heavy Lifting',
    user: { username: 'gym_junkie' },
    songs: Array(10).fill({}),
    createdAt: '2025-03-31T07:45:00Z'
  },
  {
    id: '17',
    name: 'Acoustic Vibes',
    user: { username: 'strum_and_sing' },
    songs: Array(13).fill({}),
    createdAt: '2025-03-30T16:15:00Z'
  },
  {
    id: '18',
    name: 'Dance Floor Hits',
    user: { username: 'nightowl' },
    songs: Array(20).fill({}),
    createdAt: '2025-03-29T22:30:00Z'
  },
  {
    id: '19',
    name: 'Mellow Mood',
    user: { username: 'smooth_ops' },
    songs: Array(14).fill({}),
    createdAt: '2025-03-28T13:25:00Z'
  },
  {
    id: '20',
    name: 'Festival Fire',
    user: { username: 'rave_king' },
    songs: Array(17).fill({}),
    createdAt: '2025-03-27T20:00:00Z'
  }
];

// Initialize playlists storage
export const initializePlaylistsStorage = async () => {
  try {
    const existingData = await AsyncStorage.getItem(PLAYLISTS_STORAGE_KEY);
    if (!existingData) {
      // Initialize with mock data for development
      await AsyncStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(MOCK_PLAYLISTS));
      return MOCK_PLAYLISTS;
    }
    return JSON.parse(existingData);
  } catch (error) {
    console.error('Error initializing playlists storage:', error);
    return [];
  }
};

// Store auth token
export const storeAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error storing auth token:', error);
    return false;
  }
};

// Get auth token
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Remove auth token (logout)
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing auth token:', error);
    return false;
  }
};

// Store user data
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Remove user data (logout)
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

// Store data with key
export const storeData = async (key, value) => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    return false;
  }
};

// Get data by key
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch {
        return value; // Return as string if not valid JSON
      }
    }
    return null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

// Remove data by key
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

// Clear all app data
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// Store object with TTL (time to live)
export const storeWithExpiry = async (key, value, ttl) => {
  try {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error storing ${key} with expiry:`, error);
    return false;
  }
};

// Get object that might have expired
export const getWithExpiry = async (key) => {
  try {
    const itemStr = await AsyncStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      // Item has expired
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (error) {
    console.error(`Error getting ${key} with expiry:`, error);
    return null;
  }
};

// Get playlists
export const getPlaylists = async () => {
  try {
    const playlists = await AsyncStorage.getItem(PLAYLISTS_STORAGE_KEY);
    return playlists ? JSON.parse(playlists) : [];
  } catch (error) {
    console.error('Error getting playlists:', error);
    return [];
  }
};

// Store playlists
export const storePlaylists = async (playlists) => {
  try {
    await AsyncStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    return true;
  } catch (error) {
    console.error('Error storing playlists:', error);
    return false;
  }
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
  try {
    const playlists = await getPlaylists();
    const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
    await storePlaylists(updatedPlaylists);
    return true;
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return false;
  }
};
