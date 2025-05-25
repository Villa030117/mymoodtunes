import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Modal, Platform, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import HeaderAdmin from '../src/components/admin/HeaderAdmin';
import SearchbarAdmin from '../src/components/admin/SearchbarAdmin';
import UserLogCard from '../src/components/admin/UserLogCard';
import StatsCard from '../src/components/admin/StatsCard';
import SidebarAdmin from '../src/components/admin/SidebarAdmin';
import useAuth from '../src/hooks/useAuth';
import { API_URL } from '../src/utils/constants';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UserLogsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalPlays: 0,
    newFavorites: 0,
    playlistActions: 0
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedActionType, setSelectedActionType] = useState('All Actions');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 Days');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const isSmallScreen = screenWidth < 500;
  const [searchQuery, setSearchQuery] = useState('');

  // Action types for dropdown
  const actionTypes = [
    'All Actions',
    'Login',
    'Logout',
    'Register',
    'Add to Favorites',
    'Remove from Favorites',
    'Create Playlist',
    'Add to Playlist',
    'Remove from Playlist',
    'Play Music'
  ];

  // Date ranges for dropdown
  const dateRanges = [
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'All Time'
  ];

  // Authentication check with safer navigation
  useEffect(() => {
    // Check for required props
    if (!navigation) {
      console.warn('Navigation is undefined in UserLogsScreen');
      return;
    }
    
    // Give more time for auth to complete instead of redirecting immediately
    let authTimeout;
    
    if (user === null || user === undefined) {
      console.log('User data not yet available, waiting...');
      
      // Only redirect after a delay to allow auth to complete
      authTimeout = setTimeout(() => {
        // Check again after timeout
        if (!user) {
          console.warn('User still undefined after timeout');
          // Comment out the navigation to prevent automatic redirection
          // navigation.navigate('LoginScreen');
        }
      }, 2000); // 2 second delay
    } else if (user && user.role !== 'admin') {
      console.warn('Non-admin user attempting to access admin screen');
      // Comment out the navigation to prevent automatic redirection
      // navigation.navigate('LoginScreen');
    }
    
    // Clean up timeout
    return () => {
      if (authTimeout) clearTimeout(authTimeout);
    };
  }, [navigation, user]);

  // Data fetching effect
  useEffect(() => {
    // Only try to fetch data if we're not already loading and there's no error
    if (loading || error) {
      return;
    }
    
    // Set loading state and fetch data
    const fetchData = async () => {
      // Only fetch data if we have a user, otherwise just show empty UI
      if (user) {
        setLoading(true);
        try {
          await Promise.all([
            fetchUserLogs(),
            fetchUserStats()
          ]);
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user, selectedActionType, selectedDateRange, page]);

  // Add listener for dimension changes
  useEffect(() => {
    const dimensionsHandler = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => {
      dimensionsHandler.remove();
    };
  }, []);

  const fetchUserLogs = async () => {
    try {
      // For testing/previewing - return placeholder data when no auth
      if (!user || !user.token) {
        console.warn('User or token is missing in fetchUserLogs - using test data');
        
        // Wait a moment to simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set empty data for preview purposes
        setLogs([]);
        setFilteredLogs([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      
      // Create query params based on filters
      let queryParams = `?page=${page}`;
      
      if (selectedActionType !== 'All Actions') {
        queryParams += `&actionType=${selectedActionType}`;
      }
      
      // Fix the error by safely handling selectedDateRange
      if (selectedDateRange && selectedDateRange !== 'All Time') {
        const dateRangeParam = selectedDateRange ? selectedDateRange.replace(/ /g, '') : '';
        queryParams += `&dateRange=${dateRangeParam}`;
      }
      
      try {
        const response = await axios.get(`${API_URL}/admin/logs${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.data && response.data.logs) {
          setLogs(response.data.logs);
          setFilteredLogs(response.data.logs);
          setTotalPages(response.data.totalPages || 1);
        } else {
          // Handle case where API returns unexpected data structure
          setLogs([]);
          setFilteredLogs([]);
          setTotalPages(1);
          console.warn('API returned unexpected data structure:', response.data);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError('Error communicating with the server. Please try again.');
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching user logs:', err);
      setError('Failed to load user logs. Please try again.');
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // For testing/previewing - return placeholder data when no auth
      if (!user || !user.token) {
        console.warn('User or token is missing in fetchUserStats - using test data');
        
        // Set empty stats for preview purposes
        setStats({
          activeUsers: 0,
          totalPlays: 0,
          newFavorites: 0,
          playlistActions: 0
        });
        return;
      }
      
      // Fix the error by safely handling selectedDateRange
      let dateRangeParam = '';
      if (selectedDateRange && selectedDateRange !== 'All Time') {
        dateRangeParam = selectedDateRange.replace(/ /g, '');
      }
      
      try {
        const response = await axios.get(`${API_URL}/admin/logs/stats`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
          params: {
            dateRange: dateRangeParam
          }
        });
        
        if (response.data) {
          setStats({
            activeUsers: response.data.activeUsers || 0,
            totalPlays: response.data.totalPlays || 0,
            newFavorites: response.data.newFavorites || 0,
            playlistActions: response.data.playlistActions || 0
          });
        } else {
          // Handle case where API returns unexpected data
          console.warn('API returned unexpected data structure for stats:', response.data);
        }
      } catch (apiError) {
        console.error('API Error fetching stats:', apiError);
        // We don't set an error state here to prevent blocking the UI
        // The user can still see the logs even if stats fail to load
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const handleSearch = (searchText) => {
    if (!searchText.trim()) {
      setFilteredLogs(logs);
      return;
    }
    
    const filtered = logs.filter(log => 
      (log.username || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchText.toLowerCase())
    );
    
    setFilteredLogs(filtered);
  };

  const handleActionTypeChange = (actionType) => {
    setSelectedActionType(actionType);
    setPage(1); // Reset to first page when changing filters
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    setPage(1); // Reset to first page when changing filters
  };

  const handleApplyFilters = () => {
    fetchUserLogs();
    fetchUserStats();
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Action Type</Text>
        <View style={styles.selectContainer}>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => {
              setShowActionDropdown(!showActionDropdown);
              setShowDateDropdown(false);
            }}
          >
            <Text style={styles.selectText}>{selectedActionType}</Text>
          </TouchableOpacity>
          
          {isSmallScreen ? (
            // Use Modal for better mobile experience on small screens
            <Modal
              visible={showActionDropdown}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowActionDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => setShowActionDropdown(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Action Type</Text>
                  <FlatList
                    data={actionTypes}
                    keyExtractor={(item, index) => `action-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          selectedActionType === item && styles.selectedModalItem
                        ]}
                        onPress={() => {
                          handleActionTypeChange(item);
                          setShowActionDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.modalItemText,
                          selectedActionType === item && styles.selectedModalItemText
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            // Use dropdown for larger screens
            showActionDropdown && (
              <View style={styles.dropdownContent}>
                <FlatList
                  data={actionTypes}
                  keyExtractor={(item, index) => `action-${index}`}
                  style={{ maxHeight: 200 }}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        selectedActionType === item && styles.selectedDropdownItem
                      ]}
                      onPress={() => {
                        handleActionTypeChange(item);
                        setShowActionDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        selectedActionType === item && styles.selectedDropdownItemText
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )
          )}
        </View>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Date Range</Text>
        <View style={styles.selectContainer}>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowActionDropdown(false);
            }}
          >
            <Text style={styles.selectText}>{selectedDateRange}</Text>
          </TouchableOpacity>
          
          {isSmallScreen ? (
            // Use Modal for better mobile experience on small screens
            <Modal
              visible={showDateDropdown}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDateDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => setShowDateDropdown(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Date Range</Text>
                  <FlatList
                    data={dateRanges}
                    keyExtractor={(item, index) => `date-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          selectedDateRange === item && styles.selectedModalItem
                        ]}
                        onPress={() => {
                          handleDateRangeChange(item);
                          setShowDateDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.modalItemText,
                          selectedDateRange === item && styles.selectedModalItemText
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            // Use dropdown for larger screens
            showDateDropdown && (
              <View style={styles.dropdownContent}>
                <FlatList
                  data={dateRanges}
                  keyExtractor={(item, index) => `date-${index}`}
                  style={{ maxHeight: 200 }}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        selectedDateRange === item && styles.selectedDropdownItem
                      ]}
                      onPress={() => {
                        handleDateRangeChange(item);
                        setShowDateDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        selectedDateRange === item && styles.selectedDropdownItemText
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.applyButton}
        onPress={handleApplyFilters}
      >
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );

  const statsGridContainer = {
    marginHorizontal: 16,
    marginBottom: 16,
  };
  
  const statsRow = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  };
  
  const statsCard = {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#1877F2',
    padding: 16,
  };

  const renderStatCards = () => (
    <View style={statsGridContainer}>
      <View style={statsRow}>
        <View style={[statsCard, { borderLeftColor: '#1877F2' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#f0f7ff', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 24, color: '#1877F2' }}>👤</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 14 }}>Active Users</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{stats.activeUsers}</Text>
            </View>
          </View>
        </View>
        
        <View style={[statsCard, { borderLeftColor: '#1DB954' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#f0fff0', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 24, color: '#1DB954' }}>🎵</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 14 }}>Total Plays</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{stats.totalPlays}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={statsRow}>
        <View style={[statsCard, { borderLeftColor: '#FF6B6B' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#fff0f0', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 24, color: '#FF6B6B' }}>❤️</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 14 }}>New Favorites</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{stats.newFavorites}</Text>
            </View>
          </View>
        </View>
        
        <View style={[statsCard, { borderLeftColor: '#6C63FF' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#f0f0ff', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 24, color: '#6C63FF' }}>📋</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 14 }}>Playlist Actions</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{stats.playlistActions}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderAdmin 
        title="User Logs" 
        navigation={navigation}
        onMenuPress={toggleSidebar}
      />
      
      <SidebarAdmin 
        navigation={navigation}
        isVisible={isSidebarVisible}
        onClose={toggleSidebar}
        activeScreen="UserLogsScreen"
      />
      
      {loading && !error ? (
        <View style={styles.fullLoader}>
          <ActivityIndicator size="large" color="#4169E1" style={styles.loader} />
          <Text style={styles.loaderText}>Loading user logs...</Text>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              setLoading(false);
              // Default to empty state rather than continuing to load
              setLogs([]);
              setFilteredLogs([]);
              setStats({
                activeUsers: 0,
                totalPlays: 0,
                newFavorites: 0,
                playlistActions: 0
              });
            }}
          >
            <Text style={styles.skipButtonText}>View Empty Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              fetchUserLogs();
              fetchUserStats();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.skipButton, { marginTop: 12 }]}
            onPress={() => {
              setError(null);
              setLoading(false);
              // Set empty data
              setLogs([]);
              setFilteredLogs([]);
            }}
          >
            <Text style={styles.skipButtonText}>View Empty Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {renderFilters()}
          {renderStatCards()}
          
          <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#777" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search user or action..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <Pressable 
                    onPress={() => setSearchQuery('')}
                    style={({ pressed }) => [
                      { padding: 4 },
                      pressed && { opacity: 0.7 }
                    ]}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </Pressable>
                ) : null}
              </View>
              <Pressable 
                style={({ pressed }) => [
                  styles.searchButton,
                  pressed && { 
                    backgroundColor: '#1565C0', 
                    transform: [{ scale: 0.98 }]
                  }
                ]}
                onPress={() => handleSearch(searchQuery)}
                android_ripple={{ color: '#1565C0', borderless: false }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </View>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.activityLogContainer}>
            <Text style={styles.activityLogTitle}>Activity Log</Text>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.userCell]}>User</Text>
              <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
              <Text style={[styles.headerCell, styles.timestampCell]}>Timestamp</Text>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color="#4169E1" style={styles.loader} />
            ) : (
              <FlatList
                data={filteredLogs}
                keyExtractor={(item) => (item.id || item._id || Math.random().toString())}
                renderItem={({ item }) => (
                  <UserLogCard 
                    username={item.username || 'Unknown User'}
                    action={item.action || 'Unknown Action'}
                    timestamp={item.timestamp || new Date().toISOString()}
                    description={item.description}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No user logs found</Text>
                }
              />
            )}
            
            <View style={styles.pagination}>
              <TouchableOpacity 
                style={[styles.paginationButton, page === 1 && styles.disabledButton]}
                onPress={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageIndicator}>
                Page {page} of {totalPages}
              </Text>
              
              <TouchableOpacity 
                style={[styles.paginationButton, page === totalPages && styles.disabledButton]}
                onPress={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
    padding: 0,
  },
  searchButton: {
    backgroundColor: '#1877F2',
    height: 40,
    paddingHorizontal: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1877F2',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    zIndex: 10,
  },
  filterGroup: {
    flex: 1,
    marginRight: 8,
    position: 'relative',
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectContainer: {
    position: 'relative',
    zIndex: 20,
  },
  selectButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#1877F2',
    borderRadius: 4,
    backgroundColor: 'white',
    minHeight: 45, // Increased touch target size for mobile
  },
  selectText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: '#1877F2',
    borderWidth: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 48, // Increased touch target size for mobile
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f8ff',
  },
  dropdownItemText: {
    color: '#333',
    fontSize: 14,
  },
  selectedDropdownItemText: {
    color: '#1877F2',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statsGridContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 8,
    borderColor: '#1877F2',
    borderWidth: 1,
    borderRadius: 8,
  },
  activityLogContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: 14,
  },
  userCell: {
    flex: 1,
  },
  actionCell: {
    flex: 1,
  },
  timestampCell: {
    flex: 1,
    textAlign: 'right',
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
    marginTop: 16,
  },
  paginationButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  paginationButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  mockDataBanner: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  mockDataText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  fullLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 56, // Larger touch targets in modal
  },
  selectedModalItem: {
    backgroundColor: '#f0f8ff',
  },
  modalItemText: {
    color: '#333',
    fontSize: 16,
  },
  selectedModalItemText: {
    color: '#1877F2',
    fontWeight: 'bold',
  },
});

export default UserLogsScreen;
