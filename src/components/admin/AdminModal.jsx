import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const AdminModal = ({
  visible,
  onClose,
  title,
  formData,
  onChangeInput,
  onSubmit,
  submitButtonText,
  categories,
  requireFiles = false,
  showDeleteButton = false,
  onDelete,
  isConfirmation = false,
  confirmationMessage,
  cancelButtonText = 'Cancel',
  currentAudioFile,
  currentCoverImage,
  modalType,
  playlist,
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const getEmojiForCategory = (category) => {
    switch(category) {
      case 'Happy': return '😊 Happy';
      case 'Sad': return '😔 Sad';
      case 'Strong': return '💪 Strong';
      case 'Fun': return '🎉 Fun';
      case 'Summer': return '🌞 Summer';
      default: return category;
    }
  };

  const selectAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true
      });
      
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Process the file metadata more thoroughly
        const fileInfo = {
          uri: asset.uri,
          name: asset.name || `audio_${Date.now()}.mp3`,
          mimeType: asset.mimeType || 'audio/mpeg',
          type: asset.mimeType || 'audio/mpeg',
          size: asset.size || 0
        };
        
        console.log('Selected audio file:', fileInfo);
        onChangeInput('audioFile', fileInfo);
      }
    } catch (error) {
      console.error('Error selecting audio file:', error);
    }
  };

  const selectImageFromGallery = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        const asset = result.assets[0];
        
        // Process image metadata more thoroughly
        const imageInfo = {
          uri: asset.uri,
          name: asset.uri.split('/').pop() || `image_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          type: 'image/jpeg',
          width: asset.width || 0,
          height: asset.height || 0
        };
        
        console.log('Selected image:', imageInfo);
        onChangeInput('coverImage', imageInfo);
      }
      setShowImageOptions(false);
    } catch (error) {
      console.error('Error selecting image from gallery:', error);
    }
  };

  const takePicture = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        const asset = result.assets[0];
        
        // Process camera image metadata more thoroughly
        const imageInfo = {
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          type: 'image/jpeg',
          width: asset.width || 0,
          height: asset.height || 0
        };
        
        console.log('Captured image:', imageInfo);
        onChangeInput('coverImage', imageInfo);
      }
      setShowImageOptions(false);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  // Handle the delete confirmation
  const handleDelete = () => {
    // Don't show internal confirmation, just call the delete handler directly
    onDelete();
    onClose();
  };

  if (isConfirmation) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.centeredView}>
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.confirmationText}>{confirmationMessage}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.buttonText}>{cancelButtonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]} 
                onPress={onSubmit}
              >
                <Text style={styles.buttonText}>{submitButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  if (modalType === 'playlistDetails' && playlist) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.centeredView}>
          <View style={styles.receiptModalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.receiptContent} contentContainerStyle={styles.receiptContentContainer}>
              <Text style={styles.receiptLabel}>Name:</Text>
              <Text style={styles.receiptValue}>{playlist.name || 'Untitled Playlist'}</Text>

              <Text style={styles.receiptLabel}>Created By:</Text>
              <Text style={styles.receiptValue}>{playlist.user && playlist.user.username ? playlist.user.username : 'Unknown'}</Text>

              <Text style={styles.receiptLabel}>Song Count:</Text>
              <Text style={styles.receiptValue}>{playlist.songs ? playlist.songs.length : 0}</Text>

              <Text style={styles.receiptLabel}>Created At:</Text>
              <Text style={styles.receiptValue}>{new Date(playlist.createdAt).toLocaleString()}</Text>

              <Text style={styles.receiptLabel}>Songs:</Text>
              {playlist.songs && playlist.songs.length > 0 ? (
                playlist.songs.map((song, index) => (
                  <View key={song.id || index} style={styles.songItem}>
                    <Text style={styles.songIndex}>{index + 1}.</Text>
                    <Text style={styles.songTitle}>{song.title || song.name || 'Untitled Song'}</Text>
                    <Text style={styles.songArtist}>{song.artist || 'Unknown Artist'}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSongsText}>No songs in this playlist.</Text>
              )}
            </ScrollView>
            <View style={styles.buttonContainer}>
              {showDeleteButton && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.formContainer} 
              contentContainerStyle={styles.formContentContainer}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title (required)</Text>
              <TextInput
                  style={styles.textInput}
                  placeholder="Enter title"
                  placeholderTextColor="#999"
                  value={formData ? formData.title : ''}
                  onChangeText={(text) => onChangeInput('title', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Artist (required)</Text>
              <TextInput
                  style={styles.textInput}
                  placeholder="Enter artist name"
                  placeholderTextColor="#999"
                  value={formData ? formData.artist : ''}
                  onChangeText={(text) => onChangeInput('artist', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category/Mood (required)</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => setShowCategories(!showCategories)}
                >
                  <Text style={styles.selectButtonText}>
                    {formData && formData.category ? getEmojiForCategory(formData.category) : 'Select a Category'}
                  </Text>
                  <Ionicons 
                    name={showCategories ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>

                {showCategories && (
                  <View style={styles.categoryList}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryHeaderTitle}>Select Mood</Text>
                      <TouchableOpacity 
                        style={styles.categoryCloseButton} 
                        onPress={() => setShowCategories(false)}
                      >
                        <Ionicons name="close" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <ScrollView 
                      style={styles.categoryScroll} 
                      showsVerticalScrollIndicator={true}
                      indicatorStyle="black"
                    >
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category}
                          style={[
                            styles.categoryItem,
                            formData.category === category && styles.categoryItemSelected
                          ]}
                          onPress={() => {
                            onChangeInput('category', category);
                            setShowCategories(false);
                          }}
                        >
                          <Text 
                            style={[
                              styles.categoryItemText,
                              formData.category === category && styles.categoryItemTextSelected
                            ]}
                          >
                            {getEmojiForCategory(category)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Audio File (MP3, WAV, OGG)</Text>
                <TouchableOpacity 
                  style={styles.fileButton}
                  onPress={selectAudioFile}
                >
                  <Text style={styles.fileButtonText}>Choose Audio File</Text>
                  <Ionicons name="musical-note" size={24} color="#666" style={styles.fileIcon} />
                </TouchableOpacity>
                
                      {formData && formData.audioFile ? (
                  <View style={styles.audioPreviewContainer}>
                    <View style={styles.audioPreviewContent}>
                      <Ionicons name="musical-notes" size={24} color="#1877f2" style={{marginRight: 10}} />
                      <Text style={styles.audioPreviewText} numberOfLines={1} ellipsizeMode="middle">
                        {formData.audioFile.name || 'Selected audio file'}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.cancelAudioButton}
                      onPress={() => onChangeInput('audioFile', null)}
                    >
                      <Ionicons name="close-circle" size={22} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                ) : currentAudioFile ? (
                  <View style={styles.audioPreviewContainer}>
                    <View style={styles.audioPreviewContent}>
                      <Ionicons name="musical-notes" size={24} color="#1877f2" style={{marginRight: 10}} />
                      <Text style={styles.audioPreviewText} numberOfLines={1} ellipsizeMode="middle">
                        Current file: {currentAudioFile.split('/').pop()}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.fileNameText}>
                    {requireFiles ? 'No audio file chosen' : 'No audio file chosen'}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cover Image</Text>
                <TouchableOpacity 
                  style={styles.fileButton}
                  onPress={() => setShowImageOptions(true)}
                >
                  <Text style={styles.fileButtonText}>Choose Cover Image</Text>
                  <Ionicons name="image" size={24} color="#666" style={styles.fileIcon} />
                </TouchableOpacity>
                
                {formData && formData.coverImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: formData.coverImage.uri }} 
                      style={styles.imagePreview} 
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.cancelImageButton}
                      onPress={() => onChangeInput('coverImage', null)}
                    >
                      <Ionicons name="close-circle" size={24} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                ) : currentCoverImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: currentCoverImage }} 
                      style={styles.imagePreview} 
                      resizeMode="cover"
                    />
                    <Text style={styles.currentImageText}>Current Image</Text>
                  </View>
                ) : (
                  <Text style={styles.fileNameText}>
                    No image chosen
                  </Text>
                )}

                {showImageOptions && (
                  <View style={styles.imageOptions}>
                    <Text style={styles.imageOptionsTitle}>Add Cover Image</Text>
                    <TouchableOpacity 
                      style={styles.imageOptionButton} 
                      onPress={takePicture}
                    >
                      <View style={styles.imageOptionIconContainer}>
                        <Ionicons name="camera" size={24} color="#fff" />
                      </View>
                      <Text style={styles.imageOptionText}>Take Photo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.imageOptionButton} 
                      onPress={selectImageFromGallery}
                    >
                      <View style={styles.imageOptionIconContainer}>
                        <Ionicons name="images" size={24} color="#fff" />
                      </View>
                      <Text style={styles.imageOptionText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.imageOptionButton, styles.cancelImageOption]} 
                      onPress={() => setShowImageOptions(false)}
                    >
                      <View style={[styles.imageOptionIconContainer, styles.cancelIconContainer]}>
                        <Ionicons name="close" size={24} color="#fff" />
                      </View>
                      <Text style={styles.imageOptionText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              {showDeleteButton && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.submitButton]}
                onPress={onSubmit}
              >
                <Text style={styles.buttonText}>{submitButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '95%',
    maxWidth: 500,
    maxHeight: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1877f2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: Platform.OS === 'ios' ? 400 : 450,
  },
  formContentContainer: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1877f2',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  categoryList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 250,
    zIndex: 10,
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  categoryHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryCloseButton: {
    padding: 5,
  },
  categoryScroll: {
    maxHeight: 200,
    paddingVertical: 5,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(24, 119, 242, 0.1)',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  categoryItemTextSelected: {
    color: '#1877f2',
    fontWeight: 'bold',
  },
  fileButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  fileButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  fileIcon: {
    marginLeft: 10,
  },
  fileNameText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  audioPreviewContainer: {
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  audioPreviewText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  cancelAudioButton: {
    padding: 5,
  },
  imagePreviewContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    height: 210,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  cancelImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentImageText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#1877f2',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'auto',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confirmationModal: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  confirmationHeader: {
    width: '100%',
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  confirmationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconContainer: {
    marginRight: 10,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  confirmationText: {
    marginVertical: 20,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  imageOptions: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  imageOptionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  imageOptionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1877f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cancelIconContainer: {
    backgroundColor: '#dc3545',
  },
  cancelImageOption: {
    backgroundColor: '#fff5f5',
    borderColor: '#ffebeb',
    marginBottom: 0,
  },
  imageOptionText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminModal;