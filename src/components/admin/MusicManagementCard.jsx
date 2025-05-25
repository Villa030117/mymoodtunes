import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getValidImageSource } from '../../utils/imageUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MusicManagementCard = ({ 
  title, 
  artist, 
  category, 
  coverImage, 
  audioUrl, 
  onPress, 
  onPlayPreview, 
  onStopPreview, 
  isPlaying 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const imageSource = getValidImageSource(coverImage);

  const getCategoryColor = () => {
    switch (category.toLowerCase()) {
      case 'happy': return '#FFC107';   // Amber
      case 'sad': return '#2196F3';   // Blue
      case 'strong': return '#FF5722'; // Deep Orange
      case 'fun': return  '#f368e0';//'#4CAF50';  Green 
      case 'summer': return '#FF9800'; // Orange
      default: return '#9E9E9E';      // Grey
    }
  }; 

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      onStopPreview();
    } else {
      onPlayPreview();
    }
  };

  const getCardWidth = () => {
    const sideMargins = 40; // Left and right screen margins (20 each side)
    const cardMargin = 12; // Margin between cards
    const cardsPerRow = 2;
    
    const availableWidth = SCREEN_WIDTH - sideMargins;
    const totalGap = cardMargin * (cardsPerRow - 1);
    return (availableWidth - totalGap) / cardsPerRow;
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { width: getCardWidth() }]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageLoading && !imageError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3498db" />
          </View>
        )}
        
        {imageError && (
          <View style={styles.errorContainer}>
            <Ionicons name="image-outline" size={36} color="#ccc" />
            <Text style={styles.errorText}>No Image</Text>
          </View>
        )}
        
        <Image 
          defaultSource={require('../../../assets/images/no.jpg')}
          source={imageSource}
          style={[
            styles.image,
            (imageLoading || imageError) && { opacity: 0 }
          ]}
          resizeMode="cover"
          onLoadStart={() => {
            setImageLoading(true);
            setImageError(false);
          }}
          onLoad={() => {
            setImageLoading(false);
            setImageError(false);
          }}
          onError={() => {
            console.log('Image failed to load:', coverImage);
            setImageLoading(false);
            setImageError(true);
          }}
        />
        
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        
        {audioUrl && (
          <TouchableOpacity 
            style={[
              styles.audioButton,
              isPlaying ? styles.audioButtonPlaying : null
            ]} 
            onPress={handlePlayPause}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={isPlaying ? 20 : 22} 
              color="#fff" 
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        <View style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 4,
    marginTop: 0,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#999',
    marginTop: 8,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  audioButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioButtonPlaying: {
    backgroundColor: '#1877f2',
  },
  contentContainer: {
    padding: 15,
    position: 'relative',
    minHeight: 75,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    paddingRight: 40, // Make room for edit button
  },
  artist: {
    fontSize: 14,
    color: '#666',
    paddingRight: 40, // Make room for edit button
  },
  editButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: '#3498db',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicManagementCard;
