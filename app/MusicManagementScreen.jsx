import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderAdmin from '../src/components/admin/HeaderAdmin';
import SidebarAdmin from '../src/components/admin/SidebarAdmin';
import MusicManagementCard from '../src/components/admin/MusicManagementCard';
import AdminModal from '../src/components/admin/AdminModal';
import DeleteConfirmationModal from '../src/components/admin/DeleteConfirmationModal';
import ToastNotification from '../src/components/admin/ToastNotification';
import musicService from '../src/services/musicService';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
// Constants for sidebar width
const SIDEBAR_WIDTH = 250;
const SCREEN_WIDTH = Dimensions.get('window').width;
// Update getImageUrl helper function
const getImageUrl = (imagePath) => {
  try {
    if (!imagePath) return null;
    
    // Log the input for debugging
    console.log('Processing image path:', imagePath);
    
    // Handle string paths
    if (typeof imagePath === 'string') {
      if (imagePath.startsWith('file://') || 
          imagePath.startsWith('http://') || 
          imagePath.startsWith('https://') || 
          imagePath.startsWith('data:') || 
          imagePath.startsWith('content://')) {
        return imagePath;
      }
      return `file://${imagePath}`;
    }
    
    // Handle object with uri property
    if (imagePath && typeof imagePath === 'object' && imagePath.uri) {
      const uri = imagePath.uri;
      if (typeof uri === 'string') {
        if (uri.startsWith('file://') || 
            uri.startsWith('http://') || 
            uri.startsWith('https://') || 
            uri.startsWith('data:') || 
            uri.startsWith('content://')) {
          return uri;
        }
        return `file://${uri}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in getImageUrl:', error);
    return null;
  }
};
const MusicManagementScreen = () => {
  const navigation = useNavigation();
  const [musicList, setMusicList] = useState([]);
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMood, setSelectedMood] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  // Available moods
  const moods = ['All', 'Happy', 'Sad', 'Strong', 'Fun', 'Summer'];
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: '',
    audioFile: null,
    coverImage: null
  });
  // Function to set a demo token for testing
  const ensureToken = async () => {
    try {
      // For development, always provide a test token
      if (process.env.NODE_ENV === 'development') {
        const testToken = 'test_token_for_development';
        await AsyncStorage.setItem('userToken', testToken);
        return testToken;
      }
      const existingToken = await AsyncStorage.getItem('userToken');
      if (!existingToken) {
        console.log('No token found, setting up a demo token for testing');
        const demoToken = 'demo_token_' + Date.now();
        await AsyncStorage.setItem('userToken', demoToken);
        console.log('Demo token set:', demoToken);
        return demoToken;
      }
      return existingToken;
    } catch (err) {
      console.error('Error managing token:', err);
      return 'fallback_test_token'; // Always return a token for testing
    }
  };
  // Clean up sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  // Fetch music data when component mounts
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        console.log('Attempting to fetch music data...');
        setLoading(true);
        setError(null);
        // Get token or create a demo one
        const token = await ensureToken();
        console.log('Token retrieved:', token ? 'Token exists' : 'No token found');
        if (!token) {
          console.log('Authentication required - no token available');
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }
        console.log('Calling music service...');
        const response = await musicService.getAllMusic(token);
        console.log('Response received:', response ? 'Data received' : 'No data');
        if (response && Array.isArray(response.data)) {
          console.log(`Found ${response.data.length} music items`);
          setMusicList(response.data);
          setFilteredMusic(response.data);
        } else if (response && response.data) {
          // Handle response.data not being an array but possibly an object or different structure
          console.log('Response data structure:', JSON.stringify(response.data).substring(0, 100) + '...');
          const musicData = Array.isArray(response.data) ? response.data : [];
          console.log(`Converted response to array with ${musicData.length} items`);
          setMusicList(musicData);
          setFilteredMusic(musicData);
        } else {
          console.log('No music data found or not in expected format');
          // Initialize with empty arrays
          setMusicList([]);
          setFilteredMusic([]);
        }
      } catch (err) {
        console.error('Error fetching music:', err);
        setError(`Failed to load music data: ${err.message || 'Unknown error'}`);
        // Initialize with empty arrays on error
        setMusicList([]);
        setFilteredMusic([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
    // Clean up function to ensure we don't have stale data when unmounting
    return () => {
      setMusicList([]);
      setFilteredMusic([]);
    };
  }, []);
  // Filter music based on search query and selected mood
  useEffect(() => {
    let filtered = [...musicList];
    // First filter by mood if it's not "All"
    if (selectedMood !== 'All') {
      filtered = filtered.filter(music => music.category === selectedMood);
    }
    // Then filter by search query if one exists
    if (searchQuery) {
      filtered = filtered.filter(
        music => 
          music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          music.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredMusic(filtered);
  }, [searchQuery, selectedMood, musicList]);
  // Initialize audio system when component mounts
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
        console.log('Audio system initialized');
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };
    initAudio();
  }, []);
  // Function to play a preview of audio
  const playSound = async (audioUri, music) => {
    console.log('Loading Sound');
    try {
      // Set the selectedMusic for player tracking
      setSelectedMusic(music);
      // Stop any currently playing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
      // Load and play the new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      // Listen for completion
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Error', 'Failed to play audio preview');
    }
  };
  // Function to stop sound
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };
  const handleAddMusic = () => {
    // Reset form data with empty values
    setFormData({
      title: '',
      artist: '',
      category: '', // Empty category - will be chosen manually
      audioFile: null,
      coverImage: null
    });
    setShowAddModal(true);
  };

  // When clicking the add button from empty category view
  const handleAddMusicWithCategory = (presetCategory) => {
    setFormData({
      title: '',
      artist: '',
      category: presetCategory, // Preset the category
      audioFile: null,
      coverImage: null
    });
    setShowAddModal(true);
  };

  const handleEditMusic = (music) => {
    setSelectedMusic(music);
    setFormData({
      title: music.title,
      artist: music.artist,
      category: music.category,
      audioFile: null,
      coverImage: null
    });
    setShowEditModal(true);
  };
  const handleChangeInput = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({
      visible: true,
      message,
      type
    });
  };
  // Update handleSubmitAdd function
  const handleSubmitAdd = async () => {
    try {
      setLoading(true);
      // Validation
      if (!formData.title || !formData.artist || !formData.category) {
        setError('Title, artist and category are required');
        setLoading(false);
        return;
      }
      // For AsyncStorage mock, we're not requiring audio files
      // But we'll show the same validation message for UI consistency
      if (!formData.audioFile && process.env.NODE_ENV !== 'development') {
        setError('Audio file is required');
        setLoading(false);
        return;
      }
      const token = await ensureToken();
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      // Create form data for mock storage
      const form = new FormData();
      form.append('title', formData.title);
      form.append('artist', formData.artist);
      form.append('category', formData.category);
      // Append audio file if exists
      if (formData.audioFile) {
        form.append('audioFile', {
          uri: formData.audioFile.uri,
          name: formData.audioFile.name || 'audio.mp3',
          type: formData.audioFile.mimeType || 'audio/mpeg'
        });
      }
      // Append image file with better error handling
      if (formData.coverImage) {
        const imageUri = typeof formData.coverImage === 'string' 
          ? formData.coverImage 
          : formData.coverImage.uri;
          
        console.log('Cover image URI being stored:', imageUri);
        
        form.append('coverImage', imageUri);
      }
      const response = await musicService.addMusic(form, token);
      if (response && response.data) {
        // Add the new music to the list
        setMusicList(prev => [...prev, response.data]);
        setFilteredMusic(prev => [...prev, response.data]);
        setShowAddModal(false);
        // Reset form data
        setFormData({
          title: '',
          artist: '',
          category: '',
          audioFile: null,
          coverImage: null
        });
        // Show toast notification instead of alert
        showToast('Music added successfully!');
      }
    } catch (err) {
      console.error('Error adding music:', err);
      setError('Failed to add music: ' + (err.message || 'Unknown error'));
      Alert.alert('Error', 'Failed to add music: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitEdit = async () => {
    try {
      setLoading(true);
      // Validation
      if (!formData.title || !formData.artist || !formData.category) {
        setError('Title, artist and category are required');
        setLoading(false);
        return;
      }
      const token = await ensureToken();
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      // Create form data for mock storage
      const form = new FormData();
      form.append('title', formData.title);
      form.append('artist', formData.artist);
      form.append('category', formData.category);
      // Append audio file if exists
      if (formData.audioFile) {
        form.append('audioFile', {
          uri: formData.audioFile.uri,
          name: formData.audioFile.name || 'audio.mp3',
          type: formData.audioFile.mimeType || 'audio/mpeg'
        });
      }
      // Append image file if exists
      if (formData.coverImage) {
        const imageUri = formData.coverImage.uri || formData.coverImage;
        form.append('coverImage', {
          uri: imageUri,
          name: 'cover.jpg',
          type: 'image/jpeg'
        });
      }
      const response = await musicService.updateMusic(selectedMusic._id, form, token);
      if (response && response.data) {
        // Update the music in the list
        setMusicList(prev => 
          prev.map(music => 
            music._id === selectedMusic._id ? response.data : music
          )
        );
        setFilteredMusic(prev => 
          prev.map(music => 
            music._id === selectedMusic._id ? response.data : music
          )
        );
        setShowEditModal(false);
        // Show toast notification
        showToast('Music updated successfully!');
      }
    } catch (err) {
      console.error('Error updating music:', err);
      setError('Failed to update music: ' + (err.message || 'Unknown error'));
      Alert.alert('Error', 'Failed to update music: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMusic = () => {
    // Close the edit modal first to avoid having both modals open
    setShowEditModal(false);
    // Then show our custom delete modal
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300); // Small delay to ensure smooth transition
  };
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const token = await ensureToken();
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      await musicService.deleteMusic(selectedMusic._id, token);
      // Remove the music from the list
      setMusicList(prev => 
        prev.filter(music => music._id !== selectedMusic._id)
      );
      setFilteredMusic(prev => 
        prev.filter(music => music._id !== selectedMusic._id)
      );
      setShowEditModal(false);
      setShowDeleteModal(false);
      setLoading(false);
      // Show toast notification instead of Alert
      showToast('Music deleted successfully!');
    } catch (err) {
      console.error('Error deleting music:', err);
      setError('Failed to delete music: ' + (err.message || 'Unknown error'));
      Alert.alert('Error', 'Failed to delete music: ' + (err.message || 'Unknown error'));
      setLoading(false);
      setShowDeleteModal(false);
    }
  };
  // Update renderItem function
  const renderItem = ({ item }) => {
    let coverImageUri = null;
    
    try {
      if (item.coverImage) {
        coverImageUri = getImageUrl(item.coverImage);
        console.log('Item title:', item.title);
        console.log('Original coverImage:', item.coverImage);
        console.log('Processed coverImageUri:', coverImageUri);
      }
    } catch (error) {
      console.error('Error processing cover image:', error);
    }

    return (
      <View style={{marginTop: 0, paddingTop: 0}}>
        <MusicManagementCard 
          title={item.title || "Untitled"}
          artist={item.artist || "Unknown Artist"}
          category={item.category || "Uncategorized"}
          coverImage={coverImageUri}
          audioUrl={item.audioFile}
          onPress={() => handleEditMusic(item)}
          onPlayPreview={() => playSound(item.audioFile, item)}
          isPlaying={isPlaying && sound && selectedMusic?._id === item._id}
          onStopPreview={stopSound}
        />
      </View>
    );
  };
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  // Calculate content width based on sidebar visibility and screen size
  const getContentStyles = () => {
    return {
      width: SCREEN_WIDTH,
      paddingHorizontal: 15,
      top: 60,
      bottom: 0,
    };
  };
  // Force 2 columns for the grid regardless of screen size
  const getColumnCount = () => 2;
  if (loading && musicList.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderAdmin title="Music Management" onMenuPress={toggleSidebar} navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading music data...</Text>
        </View>
        {isSidebarVisible && (
          <SidebarAdmin 
            navigation={navigation}
            isVisible={isSidebarVisible}
            onClose={toggleSidebar}
            activeScreen="MusicManagementScreen"
          />
        )}
      </SafeAreaView>
    );
  }
  if (error && musicList.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderAdmin title="Music Management" onMenuPress={toggleSidebar} navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {error.includes('Authentication') && (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              // Properly fetch music data
              const fetchMusic = async () => {
                try {
                  console.log('Retrying music fetch...');
                  // Get token or create a demo one
                  const token = await ensureToken();
                  console.log('Token for retry:', token ? 'Token exists' : 'No token found');
                  if (!token) {
                    console.log('Retry failed - no token');
                    setError('Authentication required. Please log in.');
                    setLoading(false);
                    return;
                  }
                  const response = await musicService.getAllMusic(token);
                  if (response && Array.isArray(response.data)) {
                    setMusicList(response.data);
                    setFilteredMusic(response.data);
                  } else {
                    setMusicList([]);
                    setFilteredMusic([]);
                  }
                } catch (err) {
                  console.error('Error retrying music fetch:', err);
                  setError(`Failed to load music data: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              };
              fetchMusic();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        {isSidebarVisible && (
          <SidebarAdmin 
            navigation={navigation}
            isVisible={isSidebarVisible}
            onClose={toggleSidebar}
            activeScreen="MusicManagementScreen"
          />
        )}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <HeaderAdmin title="Music Management" onMenuPress={toggleSidebar} navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.actionBar}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddMusic()} // Updated to call without event
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Mood filter buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.moodFilterContainer}
          contentContainerStyle={styles.moodFilterContent}
        >
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodFilterButton,
                selectedMood === mood && styles.moodFilterButtonActive
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text 
                style={[
                  styles.moodFilterText,
                  selectedMood === mood && styles.moodFilterTextActive
                ]}
              >
                {mood === 'Happy' ? '😊 Happy' : 
                 mood === 'Sad' ? '😔 Sad' : 
                 mood === 'Strong' ? '💪 Strong' : 
                 mood === 'Fun' ? '🎉 Fun' : 
                 mood === 'Summer' ? '🌞 Summer' : mood}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {loading && (
          <View style={styles.overlayLoader}>
            <ActivityIndicator size="large" color="#3498db" />
          </View>
        )}
        {/* Content area - both containers positioned absolutely */}
        {filteredMusic.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={{marginTop: 20}}>
              <Text style={styles.emptyText}>
                {selectedMood !== 'All' 
                  ? `No music found for "${selectedMood}" mood` 
                  : "No music found"}
              </Text>
              <TouchableOpacity 
                style={[styles.addButton, styles.topAddButton]}
                onPress={() => handleAddMusicWithCategory(selectedMood !== 'All' ? selectedMood : '')}
              >
                <Ionicons name="add-circle" size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.addButtonText}>Add Music</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              data={filteredMusic}
              renderItem={renderItem}
              keyExtractor={item => item._id || item.id || Math.random().toString()}
              numColumns={2}
              contentContainerStyle={[styles.list, {paddingTop: 5}]}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.columnWrapper}
              style={{flex: 1, width: '100%'}}
              initialNumToRender={6}
            />
          </View>
        )}
      </View>
      {isSidebarVisible && (
        <SidebarAdmin 
          navigation={navigation}
          isVisible={isSidebarVisible}
          onClose={toggleSidebar}
          activeScreen="MusicManagementScreen"
        />
      )}
      {/* Add Music Modal */}
      <AdminModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Music"
        formData={formData}
        onChangeInput={handleChangeInput}
        onSubmit={handleSubmitAdd}
        submitButtonText="Add Music"
        categories={moods.filter(mood => mood !== 'All')}
        requireFiles={true}
      />
      {/* Edit Music Modal */}
      <AdminModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Music"
        formData={formData}
        onChangeInput={handleChangeInput}
        onSubmit={handleSubmitEdit}
        submitButtonText="Update Music"
        categories={moods.filter(mood => mood !== 'All')}
        showDeleteButton={true}
        onDelete={handleDeleteMusic}
        currentAudioFile={selectedMusic?.audioFile}
        currentCoverImage={selectedMusic?.coverImage}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        title={selectedMusic?.title || ''}
      />
      {/* Toast Notification */}
      <ToastNotification 
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    position: 'relative',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#4CAF50',  // Green
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',  // Blue
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionBar: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    height: 45,
    zIndex: 10,
    backgroundColor: '#f8f9fa', // Match background color
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  clearButton: {
    padding: 6,
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 45,
    height: 45,
    borderRadius: 23,
    marginLeft: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  moodFilterContainer: {
    position: 'absolute',
    top: 70, // Position below action bar with 10px margin
    left: 0,
    right: 0,
    height: 35,
    marginLeft: 15,
    zIndex: 10,
    backgroundColor: '#f8f9fa', // Match background color
  },
  moodFilterContent: {
    paddingBottom: 0,
    paddingTop: 0,
    height: 35,
    paddingRight: 15,
  },
  moodFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
    height: 32,
    justifyContent: 'center',
    minWidth: 90,
  },
  moodFilterButtonActive: {
    backgroundColor: '#1877f2',
  },
  moodFilterText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  moodFilterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    position: 'absolute',
    top: 110, // Position right below the category filters
    left: 15,
    right: 15,
    bottom: 0,
    zIndex: 1,
  },
  list: {
    paddingBottom: 20,
    paddingTop: 0,
    marginTop: 0,
    WebkitOverflowScrolling: 'touch',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 0,
  },
  emptyContainer: {
    position: 'absolute',
    top: 110, // Position right below the category filters
    left: 15,
    right: 15,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0, // Remove padding as we'll add it in the inner container
    paddingHorizontal: 15,
    zIndex: 1,
    backgroundColor: '#f8f9fa', // Match background color
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  topAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    width: 'auto',
    height: 'auto',
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
export default MusicManagementScreen;