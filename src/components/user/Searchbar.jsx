/*import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const emojiCategories = {
  '😢': 'sad',
  '💪': 'strong',
  '😊': 'happy',
  '🎉': 'fun',
  '🌞': 'summer'
};

const Searchbar = ({ onSearch, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  
  const handleSearch = () => {
    // First check if it's an emoji search
    for (const [emoji, category] of Object.entries(emojiCategories)) {
      if (searchQuery.includes(emoji)) {
        navigation.navigate('CategoryScreen', { category, emoji });
        return;
      }
    }
        
    // Otherwise perform regular search
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={[styles.searchWrapper, isFocused && styles.searchWrapperFocused]}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={22} color="#555" style={styles.searchIcon} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder || "Search songs, artists or emojis..."}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
        />
        
        {searchQuery ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close" size={20} color="#555" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ translateY: 0 }],
  },
  searchWrapperFocused: {
    shadowColor: '#3d7cff',
    shadowOpacity: 0.2,
    elevation: 6,
    transform: [{ translateY: -2 }],
  },
  searchContainer: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Searchbar;*/

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Searchbar = ({ onSearch, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  
  // Enhanced emoji maps with multiple emojis per category
  const moodEmojis = {
    // Sad mood emojis
    sad: {
      screen: 'SadMoodScreen',
      category: 'sad',
      emojis: ['😢', '😭', '😔', '😞', '😥', '😓', '😪', '😟', '🥺', '💔', '😿']
    },
    // Strong/Motivational mood emojis
    strong: {
      screen: 'StrongMoodScreen',
      category: 'strong',
      emojis: ['💪', '🏋️', '🔥', '👊', '✊', '⚡', '🦾', '🚀', '💯', '🏆', '👑']
    },
    // Happy mood emojis
    happy: {
      screen: 'HappyMoodScreen',
      category: 'happy',
      emojis: ['😊', '😃', '😄', '😁', '🙂', '😀', '😇', '🥰', '😍', '🤗', '😌']
    },
    // Fun mood emojis
    fun: {
      screen: 'FunMoodScreen',
      category: 'fun',
      emojis: ['🎉', '🥳', '🎊', '🎈', '🎪', '🎠', '🎡', '🎮', '🎭', '🎨', '🎬']
    },
    // Summer mood emojis
    summer: {
      screen: 'SummerMoodScreen',
      category: 'summer',
      emojis: ['🌞', '🏖️', '🌴', '🏝️', '🍹', '🍉', '🏄', '🌊', '👙', '🕶️', '⛱️', '☀️', '😎', '🌻', '🥵']
    }
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Check if search contains any emoji we recognize
    for (const [mood, data] of Object.entries(moodEmojis)) {
      // Check if any of the mood's emojis is in the search query
      for (const emoji of data.emojis) {
        if (searchQuery.includes(emoji)) {
          navigation.navigate(data.screen);
          return;
        }
      }
      
      // Also check for text matches of category names
      if (searchQuery.toLowerCase().includes(data.category)) {
        navigation.navigate(data.screen);
        return;
      }
    }
    
    // If no emoji or category match, perform regular search
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle text change with potential immediate emoji search
  const handleTextChange = (text) => {
    setSearchQuery(text);
    
    // Check if the text contains any of our tracked emojis
    for (const [mood, data] of Object.entries(moodEmojis)) {
      for (const emoji of data.emojis) {
        if (text.includes(emoji)) {
          navigation.navigate(data.screen);
          return;
        }
      }
    }
  };

  return (
    <View style={[styles.searchWrapper, isFocused && styles.searchWrapperFocused]}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={22} color="#555" style={styles.searchIcon} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder || "Search songs, artists or emojis..."}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
        />
        
        {searchQuery ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close" size={20} color="#555" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ translateY: 0 }],
    transition: 'all 0.3s ease',
  },
  searchWrapperFocused: {
    shadowColor: '#3d7cff',
    shadowOpacity: 0.2,
    elevation: 6,
    transform: [{ translateY: -2 }],
  },
  searchContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  clearButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Searchbar;