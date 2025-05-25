import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderAdmin from '../src/components/admin/HeaderAdmin';
import SidebarAdmin from '../src/components/admin/SidebarAdmin';
import SearchbarAdmin from '../src/components/admin/SearchbarAdmin';
import DeleteConfirmationModal from '../src/components/admin/DeleteConfirmationModal';
import ToastNotification from '../src/components/admin/ToastNotification';
import FavoritesDetails from '../src/components/admin/FavoritesDetails';

// Mock data for development
const mockFavorites = [
  { id: 1, title: 'Shape of You', artist: 'Ed Sheeran', favoritesCount: 150, createdAt: '2025-01-15T10:30:00Z' },
  { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', favoritesCount: 120, createdAt: '2025-03-14T15:45:00Z' },
  { id: 3, title: 'Stay With Me', artist: 'Sam Smith', favoritesCount: 98, createdAt: '2025-04-13T09:20:00Z' },
  { id: 4, title: 'Bad Guy', artist: 'Billie Eilish', favoritesCount: 145, createdAt: '2025-03-12T14:15:00Z' },
  { id: 5, title: 'Someone Like You', artist: 'Adele', favoritesCount: 200, createdAt: '2025-05-11T11:10:00Z' },
  { id: 6, title: 'Uptown Funk', artist: 'Mark Ronson', favoritesCount: 180, createdAt: '2025-03-10T16:25:00Z' },
  { id: 7, title: 'Havana', artist: 'Camila Cabello', favoritesCount: 88, createdAt: '2025-03-09T13:40:00Z' },
  { id: 8, title: 'Perfect', artist: 'Ed Sheeran', favoritesCount: 167, createdAt: '2025-06-08T12:05:00Z' },
  { id: 9, title: 'Roar', artist: 'Katy Perry', favoritesCount: 140, createdAt: '2025-03-07T10:00:00Z' },
  { id: 10, title: 'Sunflower', artist: 'Post Malone', favoritesCount: 110, createdAt: '2025-12-06T14:30:00Z' },
  { id: 11, title: 'Senorita', artist: 'Shawn Mendes', favoritesCount: 135, createdAt: '2025-07-05T09:15:00Z' },
  { id: 12, title: 'Thinking Out Loud', artist: 'Ed Sheeran', favoritesCount: 172, createdAt: '2025-03-04T11:45:00Z' },
  { id: 13, title: 'Levitating', artist: 'Dua Lipa', favoritesCount: 125, createdAt: '2025-03-03T16:20:00Z' },
  { id: 14, title: 'Old Town Road', artist: 'Lil Nas X', favoritesCount: 102, createdAt: '2025-11-02T13:10:00Z' },
  { id: 15, title: 'Shallow', artist: 'Lady Gaga', favoritesCount: 155, createdAt: '2025-03-01T10:50:00Z' },
  { id: 16, title: 'Hello', artist: 'Adele', favoritesCount: 195, createdAt: '2025-08-28T15:35:00Z' },
  { id: 17, title: 'Can’t Stop The Feeling', artist: 'Justin Timberlake', favoritesCount: 130, createdAt: '2025-02-27T12:25:00Z' },
  { id: 18, title: '7 Rings', artist: 'Ariana Grande', favoritesCount: 90, createdAt: '2025-02-26T14:40:00Z' },
  { id: 19, title: 'Dance Monkey', artist: 'Tones and I', favoritesCount: 160, createdAt: '2025-02-25T11:05:00Z' },
  { id: 20, title: 'Peaches', artist: 'Justin Bieber', favoritesCount: 108, createdAt: '2025-02-24T16:15:00Z' }
];

const FavoritesManagementScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [filteredFavorites, setFilteredFavorites] = useState(mockFavorites);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFavorites(sortFavorites(favorites, sortField, sortDirection));
    } else {
      const filtered = favorites.filter(
        favorite => 
          favorite.title.toLowerCase().includes(query.toLowerCase()) ||
          favorite.artist.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFavorites(sortFavorites(filtered, sortField, sortDirection));
    }
  };

  const sortFavorites = (favoritesToSort, field, direction) => {
    return [...favoritesToSort].sort((a, b) => {
      let compareA, compareB;
      
      switch (field) {
        case 'title':
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case 'artist':
          compareA = a.artist.toLowerCase();
          compareB = b.artist.toLowerCase();
          break;
        case 'count':
          compareA = a.favoritesCount;
          compareB = b.favoritesCount;
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
    setFilteredFavorites(sortFavorites(filteredFavorites, field, newDirection));
  };

  const handleDeleteClick = (favorite) => {
    setSelectedFavorite(favorite);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    const updatedFavorites = favorites.filter(f => f.id !== selectedFavorite.id);
    setFavorites(updatedFavorites);
    setFilteredFavorites(sortFavorites(
      updatedFavorites.filter(f => 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.artist.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      sortField,
      sortDirection
    ));
    setShowDeleteModal(false);
    setSelectedFavorite(null);
    
    // Show success toast
    setToast({
      visible: true,
      message: 'Favorite deleted successfully',
      type: 'success'
    });
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Ionicons name="swap-vertical-outline" size={16} color="#666" />;
    return sortDirection === 'asc' 
      ? <Ionicons name="arrow-up-outline" size={16} color="#1877F2" />
      : <Ionicons name="arrow-down-outline" size={16} color="#1877F2" />;
  };

  return (
    <View style={styles.container}>
      <HeaderAdmin
        title="Favorites Management"
        onMenuPress={toggleSidebar}
      />
      
      <SearchbarAdmin
        placeholder="Search by title or artist..."
        value={searchQuery}
        onSearch={handleSearch}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1877F2" />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <View style={styles.tableHeader}>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.titleCell]}
                  onPress={() => handleSort('title')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText]}>Music Title</Text>
                    <SortIcon field="title" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.artistCell]}
                  onPress={() => handleSort('artist')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText]}>Artist</Text>
                    <SortIcon field="artist" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.dateCell]}
                  onPress={() => handleSort('date')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText]}>Created At</Text>
                    <SortIcon field="date" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.headerCell, styles.countCell]}
                  onPress={() => handleSort('count')}
                >
                  <View style={styles.headerContent}>
                    <Text style={[styles.headerText]}>Favorites Count</Text>
                    <SortIcon field="count" />
                  </View>
                </TouchableOpacity>
                <View style={[styles.headerCell, styles.actionsCell]}>
                  <Text style={[styles.headerText]}>Actions</Text>
                </View>
              </View>

              <ScrollView style={styles.tableBody}>
                {filteredFavorites.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No favorites found</Text>
                  </View>
                ) : (
                  filteredFavorites.map((favorite) => (
                    <View key={favorite.id} style={styles.tableRow}>
                      <View style={[styles.cell, styles.titleCell]}>
                        <Text style={styles.cellText} numberOfLines={1}>{favorite.title}</Text>
                      </View>
                      <View style={[styles.cell, styles.artistCell]}>
                        <Text style={styles.cellText} numberOfLines={1}>{favorite.artist}</Text>
                      </View>
                      <View style={[styles.cell, styles.dateCell]}>
                        <Text style={styles.cellText}>{formatDate(favorite.createdAt)}</Text>
                      </View>
                      <View style={[styles.cell, styles.countCell]}>
                        <Text style={styles.cellText}>{favorite.favoritesCount}</Text>
                      </View>
                      <View style={[styles.cell, styles.actionsCell]}>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.viewButton]}
                            onPress={() => {
                              setSelectedFavorite(favorite);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Ionicons name="eye" size={16} color="#0984e3" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteClick(favorite)}
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
          activeScreen="FavoritesManagementScreen"
        />
      )}

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFavorite(null);
        }}
        onDelete={handleDelete}
        title={selectedFavorite?.title || ''}
      />

      <FavoritesDetails
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedFavorite(null);
        }}
        favorite={selectedFavorite}
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
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 14,
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
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  titleCell: {
    width: 200,
    alignItems: 'center',
  },
  artistCell: {
    width: 150,
    alignItems: 'center',
  },
  dateCell: {
    width: 180,
    alignItems: 'center',
  },
  countCell: {
    width: 120,
    alignItems: 'center',
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
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#DC3545',
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});

export default FavoritesManagementScreen;

/* API Implementation (To be used when backend is ready)

import axios from 'axios';
import { api } from '../src/services/api';

// Replace the mock data with this API call
const fetchFavorites = async () => {
  try {
    setLoading(true);
    // Fetch music data with favorite counts
    const response = await axios.get(`${api}/admin/favorites/stats`);
    const favoritesData = response.data.map(item => ({
      id: item.music.id,
      title: item.music.title,
      artist: item.music.artist,
      favoritesCount: item.favoritesCount,
      createdAt: item.music.createdAt
    }));
    setFavorites(favoritesData);
    setFilteredFavorites(favoritesData);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    // Handle error appropriately
  } finally {
    setLoading(false);
  }
};

// Delete favorite implementation
const handleDelete = async () => {
  try {
    await axios.delete(`${api}/admin/favorites/${selectedFavorite.id}`);
    // Refresh the data
    fetchFavorites();
    setShowDeleteModal(false);
    setSelectedFavorite(null);
  } catch (error) {
    console.error('Error deleting favorite:', error);
    // Handle error appropriately
  }
};

// Initial data load
useEffect(() => {
  fetchFavorites();
}, []);

*/
