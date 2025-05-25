import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PlaylistDetails = ({ visible, onClose, playlist }) => {
  if (!playlist) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LinearGradient
            colors={['#1877F2', '#0A5BC4']}
            style={styles.modalHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.modalTitle}>Playlist Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.playlistIconContainer}>
              <MaterialCommunityIcons name="playlist-music" size={48} color="#1877F2" />
              <Text style={styles.playlistName}>{playlist.name || 'Untitled Playlist'}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="person" size={20} color="#4B7BEC" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Created By</Text>
                  <Text style={styles.infoValue}>{playlist.user?.username || 'Unknown'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer1}>
                  <Ionicons name="musical-notes" size={20} color="#FF4C61" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Songs</Text>
                  <Text style={styles.infoValue}>{playlist.songs?.length || 0} tracks</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer2}>
                  <Ionicons name="calendar" size={20} color="#00B894" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Created On</Text>
                  <Text style={styles.infoValue}>
                    {new Date(playlist.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.songsSection}>
              <Text style={styles.sectionTitle}>Playlist Songs</Text>
              {playlist.songs && playlist.songs.length > 0 ? (
                playlist.songs.map((song, index) => (
                  <View key={song.id || index} style={styles.songItem}>
                    <View style={styles.songIndexContainer}>
                      <Text style={styles.songIndex}>{index + 1}</Text>
                    </View>
                    <View style={styles.songInfo}>
                      <Text style={styles.songTitle}>{song.title || song.name || 'Untitled Song'}</Text>
                      <Text style={styles.songArtist}>{song.artist || 'Unknown Artist'}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyPlaylist}>
                  <MaterialCommunityIcons name="playlist-music" size={32} color="#ccc" />
                  <Text style={styles.emptyText}>No songs in this playlist</Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.closeFooterButton]}
              onPress={onClose}
            >
              <Ionicons name="close-circle-outline" size={20} color="#666" />
              <Text style={styles.closeFooterButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalView: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  contentContainer: {
    padding: 20,
  },
  playlistIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIconContainer1: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE6EB',

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIconContainer2: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  songsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  songIndexContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  songIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1877F2',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 13,
    color: '#666',
  },
  emptyPlaylist: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 120,
  },
  closeFooterButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  closeFooterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default PlaylistDetails;