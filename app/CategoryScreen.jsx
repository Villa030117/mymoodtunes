import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Header from '../src/components/user/Header';
import MusicCard from '../src/components/user/MusicCard';
import Searchbar from '../src/components/user/Searchbar';
import musicService from '../src/services/musicService';

const CategoryScreen = ({ route, navigation }) => {
  const { category, emoji } = route.params;
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);
  
  useEffect(() => {
    fetchCategorySongs();
  }, [category]);
  
  const fetchCategorySongs = async () => {
    try {
      setLoading(true);
      const response = await musicService.getMusicByCategory(category);
      if (response.data) {
        setSongs(response.data);
        setFilteredSongs(response.data);
      }
    } catch (error) {
      console.error('Error fetching category songs:', error);
      setError('Failed to load songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    if (!query) {
      setFilteredSongs(songs);
      return;
    }
    
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) || 
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };
  
  const handleMusicPress = (music) => {
    navigation.navigate('MusicPlayerScreen', { music });
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No songs found for this category</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title={`${emoji} ${category} MoodTunes`} 
        showBackButton 
        showHomeButton 
        onBackPress={() => navigation.goBack()}
        onHomePress={() => navigation.navigate('HomeScreen')}
      />
      
      <Searchbar onSearch={handleSearch} placeholder="Search title, artist..." />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ea" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MusicCard 
              music={item} 
              onPress={() => handleMusicPress(item)}
            />
          )}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom space
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CategoryScreen;
