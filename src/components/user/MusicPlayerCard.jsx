// src/components/user/MusicPlayerCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const MusicPlayerCard = ({ 
  music,
  isPlaying,
  currentTime,
  duration,
  playbackMode,
  isImageRotating,
  isFavorite,
  spin,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onChangePlaybackMode,
  onToggleRotation,
  onFavoritePress,
  onPlaylistPress,
  onSeek
}) => {
  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Playback mode icons
  const getPlaybackModeIcon = () => {
    switch (playbackMode) {
      case 'shuffle':
        return 'shuffle';
      case 'repeat':
        return 'repeat';
      default:
        return 'repeat-one';
    }
  };

  if (!music) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleRotation}>
        <Animated.View 
          style={[
            styles.imageContainer,
            { transform: [{ rotate: spin }] }
          ]}
        >
          <Image 
            source={{ uri: music.coverImage }} 
            style={styles.coverImage}
            defaultSource={require('../../assets/images/react-logo.png')}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{music.title || '(Title of song)'}</Text>
        <Text style={styles.artist}>{music.artist || '(name of artist)'}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 100}
            value={currentTime || 0}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#535353"
            thumbTintColor="#1DB954"
            onSlidingComplete={onSeek}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime || 0)}</Text>
            <Text style={styles.timeText}>{formatTime(duration || 0)}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onChangePlaybackMode}
          >
            <Icon name={getPlaybackModeIcon()} size={24} color="#1DB954" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onSkipPrevious}
          >
            <Icon name="skip-previous" size={24} color="#1DB954" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.iconButton, styles.playButton]} 
            onPress={onPlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={32} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onSkipNext}
          >
            <Icon name="skip-next" size={24} color="#1DB954" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onFavoritePress}
          >
            <Icon 
              name={isFavorite ? 'favorite' : 'favorite-border'} 
              size={24} 
              color={isFavorite ? '#1DB954' : '#FFFFFF'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onPlaylistPress}
          >
            <Icon name="playlist-add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: CARD_WIDTH * 0.7,
    height: CARD_WIDTH * 0.7,
    borderRadius: CARD_WIDTH * 0.35,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
  },
  progressContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeText: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#1DB954',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MusicPlayerCard;