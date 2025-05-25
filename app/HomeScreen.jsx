/* import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, RefreshControl, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../src/hooks/useAuth';
import musicService from '../src/services/musicService';
import Header from '../src/components/user/Header';
import Searchbar from '../src/components/user/Searchbar';
import MusicCard from '../src/components/user/MusicCard';

const { width } = Dimensions.get('window');

const MOOD_CATEGORIES = [
  { emoji: '😢', name: 'Sad', category: 'sad' },
  { emoji: '💪', name: 'Strong', category: 'strong' },
  { emoji: '😊', name: 'Happy', category: 'happy' },
  { emoji: '🎉', name: 'Fun', category: 'fun' },
  { emoji: '🌞', name: 'Summer', category: 'summer' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
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
      const response = await musicService.getAllMusic();
      if (response) {
        setMusicList(response);
        setFilteredMusic(response);
      }
    } catch (error) {
      console.error('Error fetching music list:', error);
      setMusicList([]);
      setFilteredMusic([]);
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
          item.artist.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMusic(filtered);
    } else {
      setFilteredMusic(musicList);
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryScreen', { category: category.category, emoji: category.emoji });
  };

  const handleMusicPress = (music) => {
    navigation.navigate('MusicPlayerScreen', { music });
  };

  const renderMoodCategories = () => (
    <View style={styles.moodContainer}>
      <Text style={styles.moodTitle}>Choose Your Mood</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodScroll}
      >
        {MOOD_CATEGORIES.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodItem}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.moodEmoji}>{category.emoji}</Text>
            <Text style={styles.moodName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const getItemLayout = (data, index) => {
    const cardWidth = (width - 48) / 2;
    const itemHeight = cardWidth + 80;
    return {
      length: itemHeight,
      offset: itemHeight * Math.floor(index / 2),
      index,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <Header />
      <View style={styles.content}>
        <Searchbar onSearch={handleSearch} />
        {renderMoodCategories()}
        
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        ) : (
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
                  No music available. Check back later!
                </Text>
              )
            }
          />
        )}
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
  moodContainer: {
    paddingVertical: 15,
    backgroundColor: 'transparent',
    marginTop: 0,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1877F2',
    marginLeft: 16,
    marginBottom: 12,
  },
  moodScroll: {
    paddingHorizontal: 8,
  },
  moodItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    width: 80,
  },
  moodEmoji: {
    fontSize: 26,
    marginBottom: 6,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: 'rgb(182, 225, 255)',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moodName: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  listContent: {
    padding: 8,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, RefreshControl, ScrollView, TouchableWithoutFeedback, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../src/hooks/useAuth';
import musicService from '../src/services/musicService';
import Header from '../src/components/user/Header';
import Searchbar from '../src/components/user/Searchbar';
import MusicCard from '../src/components/user/MusicCard';

const { width } = Dimensions.get('window');

const MOOD_CATEGORIES = [
  { emoji: '😢', name: 'Sad', category: 'sad' },
  { emoji: '💪', name: 'Strong', category: 'strong' },
  { emoji: '😊', name: 'Happy', category: 'happy' },
  { emoji: '🎉', name: 'Fun', category: 'fun' },
  { emoji: '🌞', name: 'Summer', category: 'summer' },
];

// Create a reusable ShakingEmoji component
const ShakingEmoji = ({ emoji, name }) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const startShaking = () => {
    // Reset the animation value
    shakeAnimation.setValue(0);
    
    // Create a sequence of small movements back and forth
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={startShaking}>
      <View style={styles.moodItem}>
        <Animated.Text 
          style={[
            styles.moodEmoji,
            {
              transform: [{ translateX: shakeAnimation }]
            }
          ]}
        >
          {emoji}
        </Animated.Text>
        <Text style={styles.moodName}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
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
      const response = await musicService.getAllMusic();
      if (response) {
        setMusicList(response);
        setFilteredMusic(response);
      }
    } catch (error) {
      console.error('Error fetching music list:', error);
      setMusicList([]);
      setFilteredMusic([]);
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
          item.artist.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMusic(filtered);
    } else {
      setFilteredMusic(musicList);
    }
  };

  const handleMusicPress = (music) => {
    navigation.navigate('MusicPlayerScreen', { music });
  };

  const renderMoodCategories = () => (
    <View style={styles.moodContainer}>
      <Text style={styles.moodTitle}>Choose Your Mood</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodScroll}
      >
        {MOOD_CATEGORIES.map((category, index) => (
          <ShakingEmoji 
            key={index}
            emoji={category.emoji}
            name={category.name}
          />
        ))}
      </ScrollView>
    </View>
  );

  const getItemLayout = (data, index) => {
    const cardWidth = (width - 48) / 2;
    const itemHeight = cardWidth + 80;
    return {
      length: itemHeight,
      offset: itemHeight * Math.floor(index / 2),
      index,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <Header />
      <View style={styles.content}>
        <Searchbar onSearch={handleSearch} />
        {renderMoodCategories()}
        
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        ) : (
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
                  No music available. Check back later!
                </Text>
              )
            }
          />
        )}
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
  moodContainer: {
    paddingVertical: 15,
    backgroundColor: 'transparent',
    marginTop: 0,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1877F2',
    marginLeft: 16,
    marginBottom: 12,
  },
  moodScroll: {
    paddingHorizontal: 8,
  },
  moodItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    width: 80,
  },
  moodEmoji: {
    fontSize: 26,
    marginBottom: 6,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: 'rgb(182, 225, 255)',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moodName: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  listContent: {
    padding: 8,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
