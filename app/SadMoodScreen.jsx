import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, RefreshControl, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../src/hooks/useAuth';
import musicService from '../src/services/musicService';
import Header from '../src/components/user/Header';
import Searchbar from '../src/components/user/Searchbar';
import MusicCard from '../src/components/user/MusicCard';

const { width } = Dimensions.get('window');

const SadMoodScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [musicList, setMusicList] = useState([]);
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicList = async () => {
    setIsLoading(true);
    try {
      const response = await musicService.getMusicByCategory('sad');
      setMusicList(response);
      setFilteredMusic(response);
    } catch (error) {
      console.error('Error fetching sad music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMusicList();
    setRefreshing(false);
  };

  const handleSearch = (searchText) => {
    if (searchText) {
      const filtered = musicList.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMusic(filtered);
    } else {
      setFilteredMusic(musicList);
    }
  };

  const handleMusicPress = (music) => {
    navigation.navigate('MusicPlayerScreen', { music });
  };

  // Calculate layout for optimized scrolling
  const getItemLayout = (data, index) => {
    const cardWidth = (width - 48) / 2;
    const itemHeight = cardWidth + 80; // Approximate height based on image + text
    return {
      length: itemHeight,
      offset: itemHeight * Math.floor(index / 2),
      index,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <Header title="Sad " />
      <View style={styles.content}>
        <Searchbar onSearch={handleSearch} />
        
        <View style={styles.moodHeaderContainer}>
          <Image 
            source={require('../assets/images/sad.png')} 
            style={styles.moodImage}
          />
        </View>
        
        <Text style={styles.moodDescription}>
          Melancholic melodies to accompany your reflective moments
        </Text>
        
        <FlatList
          data={filteredMusic}
          numColumns={2}
          renderItem={({ item }) => (
            <MusicCard
              music={item}
              onPress={() => handleMusicPress(item)}
              showControls={true}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#1DB954']}
              tintColor="#1DB954"
            />
          }
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>
                No sad music available. Check back later!
              </Text>
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  content: {
    flex: 1,
  },
  moodHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
    height: 120,
  },
  moodImage: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
    position: 'relative',
    top: 30,
  },
  moodDescription: {
    position: 'relative',
    top: 60,
    fontSize: 13,
    color:  '#666666',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default SadMoodScreen;