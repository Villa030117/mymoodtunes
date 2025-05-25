import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../src/components/user/Header';
import { playlistService } from '../src/services/playlistService';
import * as ImagePicker from 'expo-image-picker';

const EditPlaylistScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { playlist } = route.params;
  
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistImage, setPlaylistImage] = useState(playlist.image);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPlaylistImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (playlistName.trim() === '') {
      Alert.alert('Error', 'Playlist name cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', playlistName);
      
      if (playlistImage !== playlist.image) {
        const uriParts = playlistImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: playlistImage,
          name: `playlist_${playlist.id}.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await playlistService.updatePlaylist(playlist.id, formData);
      
      setSuccessMessage('Playlist Updated Successfully');
      
      setTimeout(() => {
        navigation.navigate('PlaylistViewScreen', { 
          playlist: { 
            ...playlist, 
            name: playlistName, 
            image: playlistImage 
          } 
        });
      }, 1500);
    } catch (error) {
      console.error('Error updating playlist:', error);
      Alert.alert('Error', 'Failed to update playlist');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Playlist"
        showBackButton
        showHomeButton
        onBackPress={() => navigation.goBack()}
        onHomePress={() => navigation.navigate('HomeScreen')}
      />
      
      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.successMessage}>{successMessage}</Text>
        </View>
      ) : null}
      
      <View style={styles.content}>
        <TouchableOpacity onPress={handleSelectImage} style={styles.imageContainer}>
          <Image 
            source={{ uri: playlistImage }} 
            style={styles.playlistImage} 
          />
          <View style={styles.imageOverlay}>
            <Ionicons name="camera" size={24} color="#fff" style={styles.cameraIcon} />
            <Text style={styles.changeImageText}>Tap to change image</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.imagePickerButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
            <Ionicons name="images-outline" size={24} color="#1a1a1a" />
            <Text style={styles.imageButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
            <Ionicons name="camera-outline" size={24} color="#1a1a1a" />
            <Text style={styles.imageButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.label}>
          <Ionicons name="musical-notes-outline" size={20} color="#1a1a1a" />
          {' '}Playlist Name
        </Text>
        <TextInput
          style={styles.input}
          value={playlistName}
          onChangeText={setPlaylistName}
          placeholder="Enter playlist name"
          autoCapitalize="none"
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Ionicons name="close-outline" size={24} color="#666" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton, isSubmitting && styles.disabledButton]} 
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <Ionicons name="save-outline" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 24,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  playlistImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  cameraIcon: {
    marginRight: 4,
  },
  changeImageText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  imageButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  imageButtonText: {
    color: '#1a1a1a',
    fontSize: 15,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '48%',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.6,
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
  successMessageContainer: {
    backgroundColor: '#4CAF50',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successMessage: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditPlaylistScreen;
