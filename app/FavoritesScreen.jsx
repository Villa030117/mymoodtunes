import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import useAuth from '../src/hooks/useAuth';
import Header from '../src/components/user/Header';
import Searchbar from '../src/components/user/Searchbar';
import playlistService from '../src/services/playlistService';
import musicService from '../src/services/musicService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = width * 0.6;

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [createPlaylistModalVisible, setCreatePlaylistModalVisible] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchPlaylists();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await musicService.getFavorites(user.id);
      if (response) {
        setFavorites(response);
        setFilteredFavorites(response);
      } else {
        console.error('No favorites found');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
    console.log('Favorites:', favorites);
    console.log('Filtered Favorites:', filteredFavorites);
  };

  const fetchPlaylists = async () => {
    try {
      const response = await playlistService.getUserPlaylists(user.id);
      setPlaylists(response);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleRemoveFromFavorites = async (musicId) => {
    try {
      await musicService.removeFavorite(user.id, musicId);
      setFavorites(favorites.filter(item => item.id !== musicId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleAddToPlaylist = (music) => {
    setSelectedMusic(music);
    if (playlists.length === 0) {
      // No playlists yet, show create playlist modal
      setCreatePlaylistModalVisible(true);
    } else {
      // Show playlists selection modal
      setModalVisible(true);
    }
  };

  const handlePlaylistSelect = async (playlistId) => {
    try {
      await playlistService.addMusicToPlaylist(playlistId, selectedMusic.id);
      Alert.alert('Success', 'Music added to playlist');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding music to playlist:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    try {
      const newPlaylist = await playlistService.createPlaylist({
        name: playlistName,
        userId: user.id,
        image: playlistImage
      });
      
      // If we have a music selected, add it to the new playlist
      if (selectedMusic) {
        await playlistService.addMusicToPlaylist(newPlaylist.id, selectedMusic.id);
      }

      setPlaylists([...playlists, newPlaylist]);
      setPlaylistName('');
      setPlaylistImage(null);
      setCreatePlaylistModalVisible(false);
      Alert.alert('Success', 'Playlist created successfully');
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera roll permissions to upload an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPlaylistImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera permissions to take a photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPlaylistImage(result.assets[0].uri);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen');
  };

  const handleMusicPress = (music) => {
    navigation.navigate('MusicPlayerScreen', { music });
  };

  const handleSearch = (searchText) => {
    if (favorites && searchText) {
      const filtered = favorites.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
  };

  // Render favorite music card
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleMusicPress(item)}
      >
        <Image 
          source={{ uri: item.coverImage }} 
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>
              {getCategoryEmoji(item.category)} {item.category}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleRemoveFromFavorites(item.id)}
        >
          <Text style={styles.actionButtonText}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAddToPlaylist(item)}
        >
          <Text style={styles.actionButtonText}>➕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Helper function to get category emoji
  const getCategoryEmoji = (category) => {
    const categories = {
      'sad': '😢',
      'strong': '💪',
      'happy': '😊',
      'fun': '🎉',
      'summer': '🌞'
    };
    return categories[category.toLowerCase()] || '';
  };

  // Conditional rendering based on authentication state
  if (!user) {
    return (
      <View style={styles.container}>
        <Header 
          title="Favorites " 
          showHomeButton 
          onHomePress={() => navigation.navigate('HomeScreen')}
        />
        <Searchbar onSearch={handleSearch} />
        <View style={styles.loginScreenContainer}>
          <View style={styles.bannerContainer}>
            <Image 
              source={require('../src/assets/images/agt2.png')} 
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.loginText}>
            You need to login to create and view favorites
          </Text>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            activeOpacity={0.7}
            onPress={handleLoginPress}
          >
            <View style={styles.shineOverlay} />
            <Text style={styles.loginButtonText}>Login / Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Favorites " 
        showHomeButton 
        onHomePress={() => navigation.navigate('HomeScreen')}
      />
      <Searchbar onSearch={handleSearch} />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Your Favorites</Text>

        <FlatList
          data={filteredFavorites || []}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>
                You haven't added any favorites yet.
              </Text>
            )
          }
        />

        {/* Playlist Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add to Playlist</Text>
              <FlatList
                data={playlists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.playlistItem}
                    onPress={() => handlePlaylistSelect(item.id)}
                  >
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.playlistImage}
                    />
                    <Text style={styles.playlistName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No playlists yet</Text>
                }
              />
              <TouchableOpacity 
                style={styles.createPlaylistButton}
                onPress={() => {
                  setModalVisible(false);
                  setCreatePlaylistModalVisible(true);
                }}
              >
                <Text style={styles.createPlaylistButtonText}>Create New Playlist</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      
      {/* Create Playlist Modal */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={createPlaylistModalVisible}
          onRequestClose={() => setCreatePlaylistModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Playlist</Text>
              
              <Text style={styles.inputLabel}>Playlist Name</Text>
            <TextInput
              style={styles.input}
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="Enter playlist name"
            />
              
              <Text style={styles.inputLabel}>Playlist Image</Text>
              <View style={styles.imagePickerButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Text style={styles.imageButtonText}>Take a photo</Text>
            </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Text style={styles.imageButtonText}>Choose from gallery</Text>
            </TouchableOpacity>
          </View>
              
              {playlistImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: playlistImage }} style={styles.imagePreview} />
                <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setPlaylistImage(null)}
                >
                    <Text style={styles.removeImageButtonText}>✕</Text>
                </TouchableOpacity>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreatePlaylist}
              >
                <Text style={styles.createButtonText}>Create Playlist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setCreatePlaylistModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
 /* loginScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },*/

  loginScreenContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Top padding to push image to top
  },

 /* bannerContainer: {
    width: '100%',
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  }bannerImage: {
    width: '100%',
    height: '100%',
  },*/

  bannerContainer: {
    width: '100%', 
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0, // No bottom margin on container
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

 /* loginText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },*/

  loginText: {
    color: '#555',
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 2, // Exactly 30px margin from image
    marginBottom: 25, // Space before button
    lineHeight: 24,
  },

  loginButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '150%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  searchbarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fefefe',
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3566b1',
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
  },
  coverImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: '#3566b1',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#3566b1',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  playlistName: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  createPlaylistButton: {
    backgroundColor: '#3566b1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createPlaylistButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#333',
    fontSize: 14,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#3566b1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;