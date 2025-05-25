import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderAdmin from '../src/components/admin/HeaderAdmin';
import SidebarAdmin from '../src/components/admin/SidebarAdmin';
import SearchbarAdmin from '../src/components/admin/SearchbarAdmin';
import playlistService from '../src/services/playlistService';
import { initializePlaylistsStorage } from '../src/utils/storage';
import PlaylistDetails from '../src/components/admin/PlaylistDetails';
import DeleteConfirmationModal from '../src/components/admin/DeleteConfirmationModal';
import ToastNotification from '../src/components/admin/ToastNotification';

const PlaylistManagementScreen = () => {
  const navigation = useNavigation();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlaylistDetailsModal, setShowPlaylistDetailsModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      await initializePlaylistsStorage();
      const response = await playlistService.getUserPlaylists();
      if (response) {
        setPlaylists(response);
        setFilteredPlaylists(sortPlaylists(response, sortField, sortDirection));
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
      Alert.alert('Error', 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPlaylists(sortPlaylists(playlists, sortField, sortDirection));
    } else {
      const filtered = playlists.filter(
        playlist => playlist.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlaylists(sortPlaylists(filtered, sortField, sortDirection));
    }
  };

  const sortPlaylists = (playlistsToSort, field, direction) => {
    return [...playlistsToSort].sort((a, b) => {
      let compareA, compareB;
      
      switch (field) {
        case 'name':
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case 'songs':
          compareA = a.songs?.length || 0;
          compareB = b.songs?.length || 0;
          break;
        case 'date':
          compareA = new Date(a.createdAt).getTime();
          compareB = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (direction === 'asc') {
        return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
      } else {
        return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
      }
    });
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    setFilteredPlaylists(sortPlaylists(filteredPlaylists, field, newDirection));
  };

  const handleDeleteClick = (playlist) => {
    setPlaylistToDelete(playlist);
    setShowDeleteModal(true);
  };

  const handleDeletePlaylist = async () => {
    try {
      if (!playlistToDelete) return;
      
      await playlistService.deletePlaylist(playlistToDelete.id);
      setPlaylists(playlists.filter(p => p.id !== playlistToDelete.id));
      setFilteredPlaylists(filteredPlaylists.filter(p => p.id !== playlistToDelete.id));
      setShowDeleteModal(false);
      setPlaylistToDelete(null);
      
      setToast({
        visible: true,
        message: 'Playlist deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      setToast({
        visible: true,
        message: 'Failed to delete playlist',
        type: 'error'
      });
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Ionicons name="swap-vertical-outline" size={16} color="#666" />;
    return sortDirection === 'asc' 
      ? <Ionicons name="arrow-up-outline" size={16} color="#1877F2" />
      : <Ionicons name="arrow-down-outline" size={16} color="#1877F2" />;
  };

  const handleViewPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistDetailsModal(true);
  };

  return (
    <View style={styles.container}>
      <HeaderAdmin
        title="Playlist Management"
        onMenuPress={toggleSidebar}
      />
      
      <SearchbarAdmin
        placeholder="Search playlists..."
        value={searchQuery}
        onSearch={handleSearch}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1877F2" />
          <Text style={styles.loadingText}>Loading playlists...</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <View style={styles.tableHeader}>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.nameCell]}
                  onPress={() => handleSort('name')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText, styles.centeredText]}>Name</Text>
                    <SortIcon field="name" />
                  </View>
                </TouchableOpacity>
                <View style={[styles.headerCell, styles.createdByCell]}>
                  <Text style={[styles.headerText, styles.centeredText]}>Created By</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.songsCell]}
                  onPress={() => handleSort('songs')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText, styles.centeredText]}>Songs</Text>
                    <SortIcon field="songs" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.dateCell]}
                  onPress={() => handleSort('date')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText, styles.centeredText]}>Created At</Text>
                    <SortIcon field="date" />
                  </View>
                </TouchableOpacity>
                <View style={[styles.headerCell, styles.actionsCell]}>
                  <Text style={[styles.headerText, styles.centeredText]}>Actions</Text>
                </View>
              </View>

              <ScrollView style={styles.tableBody}>
                {filteredPlaylists.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No playlists found</Text>
                  </View>
                ) : (
                  filteredPlaylists.map((playlist) => (
                    <View key={playlist.id} style={styles.tableRow}>
                      <View style={[styles.cell, styles.nameCell]}>
                        <Text style={styles.cellText} numberOfLines={1}>{playlist.name}</Text>
                      </View>
                      <View style={[styles.cell, styles.createdByCell]}>
                        <Text style={styles.cellText} numberOfLines={1}>{playlist.user?.username || 'Unknown'}</Text>
                      </View>
                      <View style={[styles.cell, styles.songsCell]}>
                        <Text style={styles.cellText}>{playlist.songs?.length || 0}</Text>
                      </View>
                      <View style={[styles.cell, styles.dateCell]}>
                        <Text style={styles.cellText}>{formatDate(playlist.createdAt)}</Text>
                      </View>
                      <View style={[styles.cell, styles.actionsCell]}>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.viewButton]}
                            onPress={() => {
                              setSelectedPlaylist(playlist);
                              setShowPlaylistDetailsModal(true);
                            }}
                          >
                            <Ionicons name="eye" size={16} color="#0984e3" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteClick(playlist)}
                          >
                            <Ionicons name="trash" size={16} color="#e74c3c" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}

      {showSidebar && (
        <SidebarAdmin 
          navigation={navigation}
          isVisible={showSidebar}
          onClose={toggleSidebar}
          activeScreen="PlaylistManagementScreen"
        />
      )}

      <PlaylistDetails
        visible={showPlaylistDetailsModal}
        onClose={() => setShowPlaylistDetailsModal(false)}
        playlist={selectedPlaylist}
      />

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPlaylistToDelete(null);
        }}
        onDelete={handleDeletePlaylist}
        title={playlistToDelete?.name || ''}
      />

      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  tableContainer: {
    flex: 1,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    height:63,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 14,
  },
  centeredText: {
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: Dimensions.get('window').height - 200,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  nameCell: {
    width: 180,
  },
  createdByCell: {
    width: 130,
  },
  songsCell: {
    width: 80,
    alignItems: 'center',
  },
  dateCell: {
    width: 120,
  },
  actionsCell: {
    width: 120,
    borderRightWidth: 0,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: 'rgba(9, 132, 227, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    width: Dimensions.get('window').width - 32,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PlaylistManagementScreen;
