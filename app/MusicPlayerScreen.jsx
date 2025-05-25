import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../src/hooks/useAuth';
import { useMusic } from '../src/hooks/useMusic';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../src/services/musicService';
import Header from '../src/components/user/Header';
import MusicPlayerCard from '../src/components/user/MusicPlayerCard';

const MusicPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { music } = route.params;
  const { user } = useAuth();
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    playbackMode, 
    playPause, 
    skipToNext, 
    skipToPrevious, 
    changePlaybackMode, 
    seekTo 
  } = useMusic();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalType, setModalType] = useState('favorites');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isImageRotating, setIsImageRotating] = useState(false);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
    
    // Start music playback when screen loads
    playPause(true, music);
    
    return () => {
      // Pause music when navigating away
      // But don't reset current track
      playPause(false);
    };
  }, [music, user]);
  
  useEffect(() => {
    if (isImageRotating) {
      startRotation();
    } else {
      rotateAnim.setValue(0);
      rotateAnim.stopAnimation();
    }
  }, [isImageRotating]);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const checkFavoriteStatus = async () => {
    try {
      const response = await checkIsFavorite(music.id);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoritePress = async () => {
    if (!user) {
      setModalType('favorites');
      setShowLoginModal(true);
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFromFavorites(music.id);
      } else {
        await addToFavorites(music.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handlePlaylistPress = () => {
    if (!user) {
      setModalType('playlist');
      setShowLoginModal(true);
      return;
    }
    
    setShowPlaylistModal(true);
  };

  const handleToggleRotation = () => {
    setIsImageRotating(!isImageRotating);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="MusicPlayer MoodTunes!" 
        showBackButton 
        showHomeButton 
        onBackPress={() => navigation.goBack()}
        onHomePress={() => navigation.navigate('HomeScreen')}
      />
      
      <MusicPlayerCard
        music={music}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackMode={playbackMode}
        isImageRotating={isImageRotating}
        isFavorite={isFavorite}
        spin={spin}
        onPlayPause={playPause}
        onSkipNext={skipToNext}
        onSkipPrevious={skipToPrevious}
        onChangePlaybackMode={changePlaybackMode}
        onToggleRotation={handleToggleRotation}
        onFavoritePress={handleFavoritePress}
        onPlaylistPress={handlePlaylistPress}
        onSeek={seekTo}
      />
      
      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'favorites' 
                ? 'You need to login to add to favorites' 
                : 'You need to login to add to playlist'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowLoginModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.loginButton]} 
                onPress={() => {
                  setShowLoginModal(false);
                  navigation.navigate('LoginScreen');
                }}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Playlist Modal */}
      <Modal
        visible={showPlaylistModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlaylistModal(false)}
      >
        {/* Playlist selection modal content here */}
        {/* This will be implemented in the PlaylistModal component */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#535353',
  },
  loginButton: {
    backgroundColor: '#1DB954',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MusicPlayerScreen;
