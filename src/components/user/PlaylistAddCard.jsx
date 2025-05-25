import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaylistAddCard = ({ music, onDelete, isFavorite }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: music.coverImage }}
        style={styles.image}
        defaultSource={require('../../assets/images/react-logo.png')}
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{music.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{music.artist}</Text>
        {music.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{music.category}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <Icon 
          name={isFavorite ? "favorite" : "favorite-border"}
          size={24}
          color={isFavorite ? "#ff4444" : "#666"}
        />
        <TouchableOpacity onPress={onDelete}>
          <Icon name="delete" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  categoryContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },
});

export default PlaylistAddCard;
