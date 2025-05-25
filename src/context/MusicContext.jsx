import React, { createContext, useReducer, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  duration: 0,
  position: 0,
  playbackMode: 'allLoop', // 'allLoop', 'singleLoop', 'shuffle'
  loading: false,
  error: null,
  favorites: []
};

// Create context
export const MusicContext = createContext(initialState);

// Reducer function
const musicReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SET_PLAYBACK_MODE':
      return { ...state, playbackMode: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

// Provider component
export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const soundRef = useRef(null);
  
  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
    
    // Set up audio mode
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false
      });
    };
    
    setupAudio();
    
    // Cleanup
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);
  
  // Load favorites from storage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(storedFavorites) });
      }
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  };
  
  // Save favorites to storage
  const saveFavorites = async (favorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      dispatch({ type: 'SET_FAVORITES', payload: favorites });
    } catch (error) {
      console.error('Error saving favorites', error);
    }
  };
  
  // Play a track
  const playTrack = async (track) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      // Load and play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
      dispatch({ type: 'SET_PLAYING', payload: true });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error playing track', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play track' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Playback status update listener
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      dispatch({ type: 'SET_DURATION', payload: status.durationMillis || 0 });
      dispatch({ type: 'SET_POSITION', payload: status.positionMillis || 0 });
      dispatch({ type: 'SET_PLAYING', payload: status.isPlaying });
      
      // Handle end of track
      if (status.didJustFinish && !status.isLooping) {
        handleTrackFinished();
      }
    }
  };
  
  // Handle when a track finishes playing
  const handleTrackFinished = () => {
    const { playbackMode, currentTrack, playlist } = state;
    
    if (playbackMode === 'singleLoop') {
      // Replay the same track
      if (soundRef.current) {
        soundRef.current.replayAsync();
      }
    } else if (playbackMode === 'allLoop' || playbackMode === 'shuffle') {
      // Play next track (sequential or random)
      playNextTrack();
    }
  };
  
  // Play next track
  const playNextTrack = () => {
    const { currentTrack, playlist, playbackMode } = state;
    
    if (!playlist || playlist.length === 0) return;
    
    let nextIndex;
    
    if (playbackMode === 'shuffle') {
      // Random track but not the current one
      let possibleIndices = Array.from(
        { length: playlist.length }, 
        (_, i) => i
      ).filter(i => playlist[i].id !== currentTrack?.id);
      
      if (possibleIndices.length === 0) {
        // If there's only one track, play it again
        nextIndex = playlist.findIndex(t => t.id === currentTrack?.id);
      } else {
        nextIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
      }
    } else {
      // Sequential next track
      const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    playTrack(playlist[nextIndex]);
  };
  
  // Play previous track
  const playPreviousTrack = () => {
    const { currentTrack, playlist } = state;
    
    if (!playlist || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    
    playTrack(playlist[prevIndex]);
  };
  
  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    
    if (state.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };
  
  // Seek to position
  const seekTo = async (position) => {
    if (!soundRef.current) return;
    
    await soundRef.current.setPositionAsync(position);
  };
  
  // Cycle through playback modes
  const cyclePlaybackMode = () => {
    const modes = ['allLoop', 'singleLoop', 'shuffle'];
    const currentIndex = modes.indexOf(state.playbackMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    
    dispatch({ type: 'SET_PLAYBACK_MODE', payload: modes[nextIndex] });
  };
  
  // Toggle favorite
  const toggleFavorite = async (track) => {
    let updatedFavorites;
    
    if (state.favorites.some(f => f.id === track.id)) {
      // Remove from favorites
      updatedFavorites = state.favorites.filter(f => f.id !== track.id);
    } else {
      // Add to favorites
      updatedFavorites = [...state.favorites, track];
    }
    
    await saveFavorites(updatedFavorites);
  };
  
  // Check if track is in favorites
  const isFavorite = (trackId) => {
    return state.favorites.some(f => f.id === trackId);
  };
  
  return (
    <MusicContext.Provider value={{
      ...state,
      playTrack,
      togglePlayPause,
      playNextTrack,
      playPreviousTrack,
      seekTo,
      cyclePlaybackMode,
      toggleFavorite,
      isFavorite,
      loadFavorites
    }}>
      {children}
    </MusicContext.Provider>
  );
};
