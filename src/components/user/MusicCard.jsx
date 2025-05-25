// src/components/user/MusicCard.jsx
/*import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Get device width to calculate card width for 2-column grid
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = side padding (16*2) + gap between cards (16)

const MusicCard = ({ music, onPress, showControls = false }) => {
  // Get the mood emoji based on category
  const getMoodEmoji = (category) => {
    switch (category?.toLowerCase()) {
      case 'sad': return '😢';
      case 'strong': return '💪';
      case 'happy': return '😊';
      case 'fun': return '🎉';
      case 'summer': return '🌞';
      default: return '🎵';
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => onPress && onPress(music)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#ffffff', '#f5f5f5']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: music.imageUrl || 'https://via.placeholder.com/120/cccccc/ffffff' }}
            style={styles.image}
            resizeMode="cover"
          />
          {showControls && (
            <TouchableOpacity style={styles.playButton}>
              <Icon name="play-arrow" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{music.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{music.artist}</Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryEmoji}>{getMoodEmoji(music.category)}</Text>
            <Text style={styles.categoryText}>{music.category}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: cardWidth,
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: cardWidth - 16, // Square image minus padding
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0', // Light placeholder color instead of black
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  artist: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#1DB954',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(29, 185, 84, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default MusicCard;*/

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Get device width to calculate card width for 2-column grid
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16*2) + gap between cards (16)

const MusicCard = ({ music, onPress, showControls = false }) => {
  // Get the mood emoji based on category
  const getMoodEmoji = (category) => {
    switch (category?.toLowerCase()) {
      case 'sad': return '😢';
      case 'strong': return '💪';
      case 'happy': return '😊';
      case 'fun': return '🎉';
      case 'summer': return '🌞';
      default: return '🎵';
    }
  };

  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Base64 encoded default image if no cover image is provided
  const defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGnmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxNTAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNTAiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA5LTI1VDE0OjQ4OjE5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wOS0yNVQxNDo0OTozOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wOS0yNVQxNDo0OTozOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2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';

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => onPress && onPress(music)}
      activeOpacity={0.9}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: music.imageUrl || defaultImage }}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageError(true)}
          />
          {imageLoading && (
            <ActivityIndicator style={styles.loader} size="small" color="#0000ff" />
          )}
          {showControls && (
            <TouchableOpacity style={styles.playButton}>
              <Icon name="play-arrow" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{music.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{music.artist}</Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryEmoji}>{getMoodEmoji(music.category)}</Text>
            <Text style={styles.categoryText}>{music.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: cardWidth,
    margin: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: cardWidth - 16, // Square image minus padding
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0', // Light placeholder color
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  artist: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#1DB954',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(29, 185, 63, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicCard;