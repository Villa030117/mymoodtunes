import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DeleteConfirmationModal from '../src/components/admin/DeleteConfirmationModal';
import Header from '../src/components/user/Header';
import Searchbar from '../src/components/user/Searchbar';
import PlaylistAddCard from '../src/components/user/PlaylistAddCard';
import ToastNotification from '../src/components/admin/ToastNotification';

const PlaylistViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Safely get playlist from route params or redirect
  if (!route.params?.playlist) {
    navigation.replace('PlaylistScreen');
    return null;
  }

  const initialPlaylist = route.params.playlist;
  const [playlistData, setPlaylistData] = useState(initialPlaylist);
  const [songs, setSongs] = useState(initialPlaylist.songs || []);
  const [filteredSongs, setFilteredSongs] = useState(initialPlaylist.songs || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState(initialPlaylist.name);
  const [newPlaylistImage, setNewPlaylistImage] = useState(initialPlaylist.image);
  const [showAddSongsModal, setShowAddSongsModal] = useState(false);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showDeletePlaylistModal, setShowDeletePlaylistModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    loadPlaylistSongs();
    loadAvailableSongs();
  }, [initialPlaylist.id]);

  const loadPlaylistSongs = async () => {
    try {
      const savedPlaylists = await AsyncStorage.getItem('userPlaylists');
      if (savedPlaylists) {
        const playlists = JSON.parse(savedPlaylists);
        const currentPlaylist = playlists.find(p => p.id === initialPlaylist.id);
        if (currentPlaylist) {
          setSongs(currentPlaylist.songs || []);
          setFilteredSongs(currentPlaylist.songs || []);
        }
      }
    } catch (error) {
      console.error('Error loading playlist songs:', error);
    }
  };

  const loadAvailableSongs = async () => {
    try {
      const savedSongs = await AsyncStorage.getItem('availableSongs');
      if (savedSongs) {
        setAvailableSongs(JSON.parse(savedSongs));
      }
    } catch (error) {
      console.error('Error loading available songs:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  };

  const handleAddSongs = async () => {
    if (selectedSongs.length === 0) {
      Alert.alert('Error', 'Please select at least one song');
      return;
    }

    try {
      const savedPlaylists = await AsyncStorage.getItem('userPlaylists');
      if (savedPlaylists) {
        const playlists = JSON.parse(savedPlaylists);
        const playlistIndex = playlists.findIndex(p => p.id === initialPlaylist.id);
        
        if (playlistIndex !== -1) {
          const selectedSongsData = availableSongs.filter(song => selectedSongs.includes(song.id));
          playlists[playlistIndex].songs = [...(playlists[playlistIndex].songs || []), ...selectedSongsData];
          
          await AsyncStorage.setItem('userPlaylists', JSON.stringify(playlists));
          setSongs(playlists[playlistIndex].songs);
          setFilteredSongs(playlists[playlistIndex].songs);
          setShowAddSongsModal(false);
          setSelectedSongs([]);
        }
      }
    } catch (error) {
      console.error('Error adding songs:', error);
      Alert.alert('Error', 'Failed to add songs to playlist');
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setToast({
        visible: true,
        message: 'Please enter a playlist name',
        type: 'error'
      });
      return;
    }

    try {
      const savedPlaylists = await AsyncStorage.getItem('userPlaylists');
      if (savedPlaylists) {
        const playlists = JSON.parse(savedPlaylists);
        const playlistIndex = playlists.findIndex(p => p.id === initialPlaylist.id);
        
        if (playlistIndex !== -1) {
          playlists[playlistIndex] = {
            ...playlists[playlistIndex],
            name: newPlaylistName,
            image: newPlaylistImage,
          };
          
          await AsyncStorage.setItem('userPlaylists', JSON.stringify(playlists));
          setPlaylistData(playlists[playlistIndex]);
          setToast({
            visible: true,
            message: 'Playlist updated successfully',
            type: 'success'
          });
          setShowEditModal(false);
        }
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
      Alert.alert('Error', 'Failed to update playlist');
      setToast({
        visible: true,
        message: 'Failed to update playlist',
        type: 'error'
      });
    }
  };

  const handleDeleteSong = async () => {
    if (!songToDelete) return;

    try {
      const savedPlaylists = await AsyncStorage.getItem('userPlaylists');
      if (savedPlaylists) {
        const playlists = JSON.parse(savedPlaylists);
        const playlistIndex = playlists.findIndex(p => p.id === initialPlaylist.id);
        
        if (playlistIndex !== -1) {
          playlists[playlistIndex].songs = playlists[playlistIndex].songs.filter(
            song => song.id !== songToDelete.id
          );
          
          await AsyncStorage.setItem('userPlaylists', JSON.stringify(playlists));
          setSongs(playlists[playlistIndex].songs);
          setFilteredSongs(playlists[playlistIndex].songs);
          setShowDeleteModal(false);
          setSongToDelete(null);
        }
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      Alert.alert('Error', 'Failed to delete song from playlist');
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      const savedPlaylists = await AsyncStorage.getItem('userPlaylists');
      if (savedPlaylists) {
        const playlists = JSON.parse(savedPlaylists);
        const updatedPlaylists = playlists.filter(p => p.id !== initialPlaylist.id);
        await AsyncStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
        setToast({
          visible: true,
          message: 'Playlist deleted successfully',
          type: 'success'
        });
        setShowDeletePlaylistModal(false);
        setTimeout(() => {
          navigation.navigate('PlaylistScreen');
        }, 1500); // Navigate after toast shows
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      setToast({
        visible: true,
        message: 'Failed to delete playlist',
        type: 'error'
      });
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Choose Image Source',
      'Select where you want to get the image from',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
      ],
    );
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setNewPlaylistImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Please grant permission to use the camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setNewPlaylistImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const renderPlaylistHeader = () => (
    <View style={styles.playlistHeader}>
      <View style={styles.headerControls}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('PlaylistScreen')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#1a1a1a" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setShowOptionsModal(true)}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#555555" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setShowEditModal(true)}>
        <Image source={{ uri: playlistData.image }} style={styles.playlistImage} />
      </TouchableOpacity>
      <Text style={styles.playlistName}>{playlistData.name}</Text>
      <Text style={styles.songCount}>{songs.length} songs</Text>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddSongsModal(true)}
      >
        <Text style={styles.buttonText}>Add Songs</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <PlaylistAddCard
      music={item}
      onDelete={() => {
        setSongToDelete(item);
        setShowDeleteModal(true);
      }}
      isFavorite={item.isFavorite}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title="Playlists "
        showBackButton
        showHomeButton
        onBackPress={() => navigation.goBack()}
        onHomePress={() => navigation.navigate('HomeScreen')}
      />

      {successMessage ? (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>{successMessage}</Text>
        </View>
      ) : null}

      {renderPlaylistHeader()}
      
      <Searchbar
        placeholder="Search songs..."
        onSearch={handleSearch}
        value={searchQuery}
      />

      {songs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            The playlist is empty. Add some songs to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSongs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>

            <View style={styles.imageContainer}>
              {newPlaylistImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: newPlaylistImage }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setNewPlaylistImage('')}
                  >
                    <Text style={styles.removeImageButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.imagePickerButtons}>
                    <TouchableOpacity 
                      style={styles.imageButton} 
                      onPress={takePhoto}
                    >
                      <Ionicons name="camera-outline" size={24} color="#1a1a1a" />
                      <Text style={styles.imageButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.imageButton} 
                      onPress={pickImage}
                    >
                      <Ionicons name="images-outline" size={24} color="#1a1a1a" />
                      <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.imagePicker}>
                    <Ionicons name="image-outline" size={40} color="#666" />
                    <Text style={styles.imagePickerText}>Add Cover Image</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>Playlist Name</Text>
            <TextInput
              style={styles.input}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Enter playlist name"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewPlaylistName('');
                  setNewPlaylistImage('');
                  setShowCreateModal(false);
                }}
              >
                <Ionicons name="close-outline" size={24} color="#666" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddSongs}
              >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.saveButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Playlist Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Playlist</Text>

            <View style={styles.imageContainer}>
              {playlistData.image && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: newPlaylistImage || playlistData.image }} style={styles.imagePreview} />
                  <View style={styles.imageOverlay}>
                    <Text style={[styles.currentImageLabel, { color: '#fff' }]}>Current Image</Text>
                  </View>
                </View>
              )}

              <View>
                <View style={styles.imagePickerButtons}>
                  <TouchableOpacity 
                    style={styles.imageButton} 
                    onPress={takePhoto}
                  >
                    <Ionicons name="camera-outline" size={24} color="#1a1a1a" />
                    <Text style={styles.imageButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.imageButton} 
                    onPress={pickImage}
                  >
                    <Ionicons name="images-outline" size={24} color="#1a1a1a" />
                    <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                
                {" "}Playlist Name
              </Text>
              <TextInput
                style={styles.input}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                placeholder="Enter playlist name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewPlaylistName(playlistData.name);
                  setNewPlaylistImage(playlistData.image);
                  setShowEditModal(false);
                }}
              >
                <Ionicons name="close-outline" size={24} color="#666" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdatePlaylist}
              >
                <Ionicons name="checkmark-outline" size={24} color="#fff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Songs Modal */}
      <Modal
        visible={showAddSongsModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddSongsModal(false);
          setSelectedSongs([]);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Songs</Text>

            <FlatList
              data={availableSongs}
              renderItem={({ item }) => {
                const isSelected = selectedSongs.includes(item.id);
                const isAlreadyInPlaylist = songs.some(song => song.id === item.id);

                return (
                  <TouchableOpacity
                    style={[
                      styles.songItem,
                      isSelected && styles.selectedSong,
                      isAlreadyInPlaylist && styles.disabledSong
                    ]}
                    onPress={() => {
                      if (!isAlreadyInPlaylist) {
                        if (isSelected) {
                          setSelectedSongs(selectedSongs.filter(id => id !== item.id));
                        } else {
                          setSelectedSongs([...selectedSongs, item.id]);
                        }
                      }
                    }}
                    disabled={isAlreadyInPlaylist}
                  >
                    <Image
                      source={{ uri: item.coverImage }}
                      style={styles.songImage}
                    />
                    <View style={styles.songDetails}>
                      <Text style={styles.songTitle}>{item.title}</Text>
                      <Text style={styles.songArtist}>{item.artist}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </View>
                    )}
                    {isAlreadyInPlaylist && (
                      <View style={styles.alreadyAddedTag}>
                        <Text style={styles.alreadyAddedText}>Added</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.songsListContent}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddSongsModal(false);
                  setSelectedSongs([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddSongs}
              >
                <Text style={styles.saveButtonText}>
                  Add Selected ({selectedSongs.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity 
          style={styles.optionsOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsMenu}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsModal(false);
                setShowEditModal(true);
              }}
            >
              <Ionicons name="create-outline" size={22} color="#1877F2" />
              <Text style={[styles.optionText, { color: '#1877F2' }]}>Edit Playlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsModal(false);
                setShowDeletePlaylistModal(true);
              }}
            >
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Playlist</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <DeleteConfirmationModal
        visible={showDeletePlaylistModal}
        onClose={() => setShowDeletePlaylistModal(false)}
        onDelete={handleDeletePlaylist}
        title={playlistData.name}
      />

      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  buttonText:{
    color:'#ffffff',
    fontSize:16,
    fontWeight:'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  headerControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
    
  },
  playlistHeader: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  playlistImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  songCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#1877F2',
    //backgroundColor: '#ffffff',
    backgroundImage: 'linear-gradient(145deg, #1a86ff, #1669cc)', // subtle gradient
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8, // for Android
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    transition: 'all 0.3s ease-in-out', // web only
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    padding: 16,
  },
  successMessage: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
  },
  successMessageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  currentImageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: 180, // Changed from 100%
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    alignItems: 'center',
  },
  currentImageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '500',
  },
  imagePickerText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#1877F2',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  songsListContent: {
    paddingVertical: 12,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSong: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1877F2',
  },
  disabledSong: {
    opacity: 0.6,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  songDetails: {
    flex: 1,
    marginLeft: 16,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alreadyAddedTag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alreadyAddedText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  optionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  optionsMenu: {
    backgroundColor: '#fff',
    position: 'relative',
    top: 55,
    right: 20,
    borderRadius: 10,
    padding: 8,
    width: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PlaylistViewScreen;
