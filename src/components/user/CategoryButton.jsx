import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryButton = ({ category, isActive, onPress }) => {
  const getCategoryEmoji = (category) => {
    switch (category.toLowerCase()) {
      case 'all':
        return '🎵';
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'strong':
      case 'motivation':
        return '💪';
      case 'fun':
        return '🎉';
      case 'summer':
        return '🌞';
      default:
        return '🎵';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.activeContainer : null
      ]}
      onPress={() => onPress(category)}
    >
      <Text style={styles.emoji}>{getCategoryEmoji(category)}</Text>
      <Text style={[
        styles.text,
        isActive ? styles.activeText : null
      ]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeContainer: {
    backgroundColor: '#4dabf7',
  },
  emoji: {
    fontSize: 18,
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    color: '#444',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default CategoryButton;
