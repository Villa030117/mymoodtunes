import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const MusicPlayerCard = ({ 
  music,
  isPlaying,
  currentTime,
  duration,
  playbackMode,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onChangePlaybackMode,
  onSeek,
  spin, // Animated value for rotation
  onToggleRotation,
  isFavorite,
  onToggleFavorite,
  onAddToPlaylist
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlaybackModeIcon = () => {
    switch (playbackMode) {
      case 'shuffle':
        return 'shuffle';
      case 'repeat':
        return 'repeat';
      default:
        return 'repeat-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.imageContainer,
          { transform: [{ rotate: spin }] }
        ]}
      >
        <Image 
          source={{ uri: music?.coverImage }} 
          style={styles.coverImage}
        />
      </Animated.View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{music?.title || '(Title of song)'}</Text>
        <Text style={styles.artist}>{music?.artist || '(name of artist)'}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 100}
            value={currentTime || 0}
            minimumTrackTintColor="#4169E1"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#4169E1"
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
            <Icon name={getPlaybackModeIcon()} size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onSkipPrevious}
          >
            <Icon name="play-skip-back" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.iconButton, styles.playButton]} 
            onPress={onPlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play'} 
              size={32} 
              color="#fff" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onSkipNext}
          >
            <Icon name="play-skip-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onToggleFavorite}
          >
            <Icon 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? '#ff4081' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: CARD_WIDTH * 0.7,
    height: CARD_WIDTH * 0.7,
    borderRadius: CARD_WIDTH * 0.35,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: CARD_WIDTH * 0.35,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#666',
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
    color: '#666',
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
    backgroundColor: '#4169E1',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicPlayerCard;