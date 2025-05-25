// API Endpoints
export const API_BASE_URL = 'http://localhost:3000/api'; // Updated to use localhost for local development
export const API_URL = API_BASE_URL;

// Authentication
export const AUTH_TOKEN_KEY = '@MoodTunes:authToken';
export const USER_DATA_KEY = '@MoodTunes:userData';

// Music Categories/Moods
export const MOODS = {
  SAD: 'sad',
  STRONG: 'strong',
  HAPPY: 'happy',
  FUN: 'fun',
  SUMMER: 'summer'
};

export const MOOD_EMOJIS = {
  [MOODS.SAD]: '😢',
  [MOODS.STRONG]: '💪',
  [MOODS.HAPPY]: '😊',
  [MOODS.FUN]: '🎉',
  [MOODS.SUMMER]: '🌞'
};

export const MUSIC_CATEGORIES = [
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'strong', name: 'Strong', emoji: '💪' },
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'fun', name: 'Fun', emoji: '🎉' },
  { id: 'summer', name: 'Summer', emoji: '🌞' },
];

// Playback modes
export const PLAYBACK_MODES = {
  ALL_LOOP: 'all_loop',
  SINGLE_LOOP: 'single_loop',
  SHUFFLE: 'shuffle'
};

export const PLAYER_MODES = {
  ALL_LOOP: 'ALL_LOOP',
  SINGLE_LOOP: 'SINGLE_LOOP',
  SHUFFLE: 'SHUFFLE'
};

// Routes
export const ROUTES = {
  // Auth routes
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  
  // User routes
  HOME: 'Home',
  MUSIC_PLAYER: 'MusicPlayer',
  PLAYLIST: 'PlaylistMain',
  PLAYLIST_VIEW: 'PlaylistView',
  EDIT_PLAYLIST: 'EditPlaylist',
  FAVORITES: 'FavoritesMain',
  CATEGORY: 'Category',
  
  // Admin routes
  DASHBOARD: 'Dashboard',
  USER_LOGS: 'UserLogs',
  MUSIC_MANAGEMENT: 'MusicManagement',
  FAVORITES_MANAGEMENT: 'FavoritesManagement',
  PLAYLIST_MANAGEMENT: 'PlaylistManagement'
};

// Status codes for handling responses
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  LOGIN_REQUIRED: 'You need to login to access this feature.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGGED_IN: 'Successfully logged in!',
  SIGNED_UP: 'Account created successfully!',
  PLAYLIST_CREATED: 'Playlist created successfully!',
  PLAYLIST_UPDATED: 'Playlist updated successfully!',
  SONG_ADDED: 'Song added to playlist successfully!',
  FAVORITE_ADDED: 'Song added to favorites!',
  FAVORITE_REMOVED: 'Song removed from favorites!',
  MUSIC_ADDED: 'Music added successfully!',
  MUSIC_UPDATED: 'Music updated successfully!',
  MUSIC_DELETED: 'Music deleted successfully!'
};

// Toast messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PLAYLIST_CREATED: 'Playlist created successfully!',
  PLAYLIST_UPDATED: 'Playlist updated successfully!',
  ADDED_TO_FAVORITES: 'Added to favorites!',
  REMOVED_FROM_FAVORITES: 'Removed from favorites!',
  ADDED_TO_PLAYLIST: 'Added to playlist!',
  REMOVED_FROM_PLAYLIST: 'Removed from playlist!',
  MUSIC_ADDED: 'Music added successfully!',
  MUSIC_UPDATED: 'Music updated successfully!',
  MUSIC_DELETED: 'Music deleted successfully!',
  ERROR: 'An error occurred. Please try again.'
};

// Validations
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
};

// Animation timings
export const ANIMATION = {
  TOAST_DURATION: 1500,
  FADE_DURATION: 300,
  ROTATION_DURATION: 10000
};

// Image picker options
export const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  quality: 0.7,
  includeBase64: false,
  maxWidth: 800,
  maxHeight: 800
};

// Default admin credentials
export const ADMIN = {
  EMAIL: 'admin',
  PASSWORD: '1234'
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  CURRENT_MUSIC: 'current_music',
  PLAYER_STATE: 'player_state'
};
