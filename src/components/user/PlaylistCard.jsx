/*
// src/components/user/PlaylistCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PlaylistCard = ({ playlist, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={playlist.image ? { uri: playlist.image } : require('../../assets/images/wa5.png')}
        style={styles.image}
        defaultSource={require('../../assets/images/wa5.png')}
      />
      <Text style={styles.name} numberOfLines={2}>{playlist.name}</Text>
      <Text style={styles.songCount}>
        {playlist.songs?.length || 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}
      </Text>
    </TouchableOpacity>
  );
};

//const styles = StyleSheet.create({
  const styles = StyleSheet.create({
    container: {
      width: '48%',
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden', // Ensures corner radii apply cleanly
      marginBottom: 0,
      elevation: 6, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    image: {
      width: '100%',
      height: 145,
      resizeMode: 'cover',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111',
      marginTop: 12,
      marginHorizontal: 12,
      marginBottom: 4,
    },
    songCount: {
      fontSize: 14,
      color: '#666',
      marginHorizontal: 12,
      marginBottom: 12,
    },
  });
  

export default PlaylistCard;
*/

// src/components/user/PlaylistCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PlaylistCard = ({ playlist, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={playlist.image ? { uri: playlist.image } : require('../../assets/images/wa5.png')}
        style={styles.image}
        defaultSource={require('../../assets/images/wa5.png')}
      />
      <Text style={styles.name} numberOfLines={2}>{playlist.name}</Text>
      <Text style={styles.songCount}>
        {playlist.songs?.length || 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#fff', // Ash Gray
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 0,
    elevation: 2.5, // Moderate Android shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 145,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    //color: '#111',
    color:  '#3385FF',//'#0057B8', Rich Blue
    marginTop: 12,
    marginHorizontal: 12,
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 12,
    marginBottom: 12,
  },
});

export default PlaylistCard;
