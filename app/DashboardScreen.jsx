import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  Modal,
  FlatList,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderAdmin from '../src/components/admin/HeaderAdmin';
import SidebarAdmin from '../src/components/admin/SidebarAdmin';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import musicService from '../src/services/musicService';
import ToastNotification from '../src/components/admin/ToastNotification';
import DeleteConfirmationModal from '../src/components/admin/DeleteConfirmationModal';

// Update getImageUrl helper function
const getImageUrl = (imagePath) => {
  try {
    // Debug logs
    console.log('Raw image path:', imagePath);
    console.log('Image path type:', typeof imagePath);

    // Handle null/undefined
    if (!imagePath) {
      console.log('No image path provided');
      return null;
    }

    // Handle object with uri property
    if (typeof imagePath === 'object' && imagePath.uri) {
      console.log('Image path is object with URI:', imagePath.uri);
      return imagePath.uri;
    }

    // Handle string path
    if (typeof imagePath === 'string') {
      console.log('Image path is string:', imagePath);
      if (Platform.OS === 'web') {
        if (imagePath.startsWith('data:') || 
            imagePath.startsWith('blob:') || 
            imagePath.startsWith('http')) {
          return imagePath;
        }
        if (imagePath.startsWith('file://')) {
          return imagePath.slice(7);
        }
      }
      return imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`;
    }

    console.log('Invalid image path format');
    return null;
  } catch (error) {
    console.error('Error processing image path:', error);
    return null;
  }
};

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const windowDimensions = { width, height };
// Helper function to darken/lighten color for gradients
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;
  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);
  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
  return "#" + RR + GG + BB;
};
// Helper function to get gradient colors based on activity type
const getActivityGradient = (type) => {
  switch(type) {
    case 'Login':
      return ['#00C6FF', '#0072FF']; // Green gradient
    case 'Register':
      return ['#4facfe', '#00f2fe']; // Aqua-blue gradient
    case 'Logout':
      return ['#f5576c', '#f093fb']; // Crimson-pink gradient
    case 'Create Playlist':
      return ['#00c853', '#43e97b']; // Green gradient
    case 'Add to Playlist':
      return ['#11998e', '#38ef7d']; // Teal-lime gradient
    case 'Remove from Playlist':
      return ['#6c5ce7', '#a29bfe']; // Violet gradient
    case 'Add to Favorites':
      return ['#DC143C', '#FF4500',]; // Orange-red gradient
    case 'Remove from Favorites':
      return ['#A52A2A', '#B22222']; // Pink gradient
    case 'Play Music':
      return ['#f39c12','#fdcb6e', '#FFC107']; // Golden yellow gradient
    default:
      return ['#764ba2', '#667eea']; // Blue-purple gradient
  }
};
// Default moods data if no music with moods exists yet
const defaultMoods = [
  { name: 'Happy', icon: 'emoticon-happy', color: '#fdcb6e' },
  { name: 'Sad', icon: 'emoticon-sad', color: '#74b9ff' },
  { name: 'Fun', icon: 'party-popper', color: '#ff7675' },
  { name: 'Strong', icon: 'arm-flex', color: '#55efc4' },
  { name: 'Summer', icon: 'weather-sunny', color: '#e17055' }
];
// Sample activities data
const defaultActivities = [];
// Helper function to get the appropriate icon for each activity type
const getActivityIcon = (type) => {
  switch(type) {
    case 'Login':
      return 'login';
    case 'Logout':
      return 'logout';
    case 'Register':
      return 'account-plus';
    case 'Create Playlist':
      return 'playlist-plus';
    case 'Add to Playlist':
      return 'playlist-music-outline';
    case 'Remove from Playlist':
      return 'playlist-remove';
    case 'Add to Favorites':
      return 'heart-plus';
    case 'Remove from Favorites':
      return 'heart-remove';
    case 'Play Music':
      return 'play-circle';
    default:
      return 'information';
  }
};
const DashboardScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalSongs: '0',
    totalMoods: '0', // Initialize with 0 instead of default 5
    totalPlaylists: '0',
    totalListeners: '0',
    totalFavorites: '0'
  });
  const [activities, setActivities] = useState(defaultActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [moodsModalVisible, setMoodsModalVisible] = useState(false);
  const [moodsList, setMoodsList] = useState(defaultMoods);
  const [dimensions, setDimensions] = useState(windowDimensions);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [songsModalVisible, setSongsModalVisible] = useState(false);
  const [songsList, setSongsList] = useState([]);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Update dimensions when screen size changes (orientation change)
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);
  useEffect(() => {
    fetchDashboardData();
    fetchSongsList();
  }, []);
  // Add a focus listener to refresh data when returning to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when screen is focused
      fetchDashboardData();
      fetchSongsList();
    });
    // Clean up the listener when component unmounts
    return unsubscribe;
  }, [navigation]);
  // Function to fetch dashboard data from AsyncStorage (temporary backend)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // --- TEMPORARY ASYNC STORAGE IMPLEMENTATION ---
      // Get music data to count total songs and unique moods - using the same musicService as MusicManagementScreen
      let parsedMusicData = [];
      try {
        const musicResponse = await musicService.getAllMusic();
        if (musicResponse && musicResponse.data) {
          parsedMusicData = musicResponse.data;
        }
      } catch (err) {
        console.error("Error fetching music data:", err);
      }
      // Get unique moods/categories from music data
      const uniqueMoods = new Set();
      const moodsList = [];
      if (Array.isArray(parsedMusicData)) {
        parsedMusicData.forEach(music => {
          if (music.category && music.category !== 'All' && music.category.trim() !== '') {
            uniqueMoods.add(music.category);
          }
        });
        // Convert Set to Array with mood objects
        uniqueMoods.forEach(mood => {
          let icon = 'emoticon-outline';
          let color = '#74b9ff';
          // Assign appropriate icon and color based on mood
          if (mood === 'Happy') {
            icon = 'emoticon-happy';
            color = '#fdcb6e';
          } else if (mood === 'Sad') {
            icon = 'emoticon-sad';
            color = '#74b9ff';
          } else if (mood === 'Fun') {
            icon = 'party-popper';
            color = '#ff7675';
          } else if (mood === 'Strong') {
            icon = 'arm-flex';
            color = '#55efc4';
          } else if (mood === 'Summer') {
            icon = 'weather-sunny';
            color = '#e17055';
          }
          moodsList.push({
            name: mood,
            icon: icon,
            color: color
          });
        });
        // Update moods array for the modal
        setMoodsList(moodsList.length > 0 ? moodsList : defaultMoods);
      }
      // Get playlists data
      const playlistsData = await AsyncStorage.getItem('playlists');
      let parsedPlaylists = [];
      if (playlistsData) {
        parsedPlaylists = JSON.parse(playlistsData);
      }
      // Get favorites data
      const favoritesData = await AsyncStorage.getItem('favorites');
      let parsedFavorites = [];
      if (favoritesData) {
        parsedFavorites = JSON.parse(favoritesData);
      }
      // Get listeners data (this would be user count in real API)
      const listeners = await AsyncStorage.getItem('listeners');
      let parsedListeners = 0; // Default value
      if (listeners) {
        parsedListeners = JSON.parse(listeners);
      }
      // Set stats based on retrieved data - use actual unique mood count
      setStats({
        totalSongs: parsedMusicData.length.toString() || '0',
        totalMoods: uniqueMoods.size > 0 ? uniqueMoods.size.toString() : '0',
        totalPlaylists: parsedPlaylists.length.toString() || '0',
        totalListeners: parsedListeners.toString() || '0',
        totalFavorites: parsedFavorites.length.toString() || '0'
      });
      // Get recent activities from AsyncStorage or create sample data if none exists
      const activitiesData = await AsyncStorage.getItem('activities');
      let parsedActivities = [];
      if (activitiesData) {
        try {
          parsedActivities = JSON.parse(activitiesData);
          if (!Array.isArray(parsedActivities)) {
            parsedActivities = [];
          }
        } catch (e) {
          console.error('Error parsing activities data:', e);
          parsedActivities = [];
        }
      } else {
        // Initialize with sample activities - more than 6 to demonstrate scrolling
        parsedActivities = [
          { 
            user: 'John Doe', 
            description: 'John Doe created playlist "Summer Vibes"', 
            type: 'Create Playlist',
            timestamp: '2025-04-13 14:32:05' 
          },
          { 
            user: 'Maria Garcia', 
            description: 'Maria Garcia added "Thinking Out Loud" to Favorites', 
            type: 'Add to Favorites',
            timestamp: '2025-04-13 12:15:22' 
          },
          { 
            user: 'Alex Smith', 
            description: 'Alex Smith logged in', 
            type: 'Login',
            timestamp: '2025-04-12 18:45:10' 
          },
           { 
            user: 'Alex Smith', 
            description: 'Alex Smith logged in', 
            type: 'Login',
            timestamp: '2025-04-12 18:45:10' 
          },
           { 
            user: 'Alex Smith', 
            description: 'Alex Smith logged in', 
            type: 'Login',
            timestamp: '2025-04-12 18:45:10' 
          },
          { 
            user: 'Emma Johnson', 
            description: 'Emma Johnson added "Shape of You" to playlist "Workout Mix"', 
            type: 'Add to Playlist',
            timestamp: '2025-04-12 10:21:33' 
          },
          { 
            user: 'James Wilson', 
            description: 'James Wilson registered a new account', 
            type: 'Register',
            timestamp: '2025-04-11 09:05:47' 
          },
          { 
            user: 'Sophie Brown', 
            description: 'Sophie Brown removed "Bad Guy" from Favorites', 
            type: 'Remove from Favorites',
            timestamp: '2025-04-11 08:12:30' 
          },
          { 
            user: 'David Kim', 
            description: 'David Kim logged out', 
            type: 'Logout',
            timestamp: '2025-04-10 22:45:18' 
          },
           { 
            user: 'Kim Bajan', 
            description: 'Kim Bajan removed "Bad Guy" from Playlist', 
            type: 'Remove from Playlist',
            timestamp: '2025-04-10 22:45:18' 
          },
          { 
            user: 'Linda Chen', 
            description: 'Linda Chen played "Blinding Lights"', 
            type: 'Play Music',
            timestamp: '2025-04-10 20:30:42' 
          }
        ];
        // Store sample activities in AsyncStorage for future use
        await AsyncStorage.setItem('activities', JSON.stringify(parsedActivities));
      }
      // Set activities state
      setActivities(parsedActivities);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
      // Even on error, ensure state variables have default values
      setActivities([]);
      setMoodsList(defaultMoods);
      setStats({
        totalSongs: '0',
        totalMoods: '0',
        totalPlaylists: '0',
        totalListeners: '0',
        totalFavorites: '0'
      });
    }
  };
  // Update fetchSongsList to include better debugging
  const fetchSongsList = async () => {
    try {
      const musicData = await AsyncStorage.getItem('music');
      if (musicData) {
        const parsedMusic = JSON.parse(musicData);
        console.log("Fetched music from AsyncStorage:", parsedMusic);
        if (parsedMusic && parsedMusic.length > 0) {
          console.log("Sample image path:", parsedMusic[0].coverImage); // Debug log
          setSongsList(parsedMusic);
          return;
        }
      }

      const response = await musicService.getAllMusic();
      if (response && response.data) {
        console.log("Fetched music from service:", response.data);
        if (response.data.length > 0) {
          console.log("Sample image path:", response.data[0].coverImage); // Debug log
        }
        setSongsList(response.data);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      setSongsList([]);
    }
  };
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  // Function to view activity details
  const viewActivity = (activity) => {
    if (!activity) {
      return;
    }
    // Set the alert data and show the alert
    setAlertData(activity);
    setAlertVisible(true);
  };
  // Function to delete activity
  const deleteActivity = (index) => {
    setActivityToDelete({ index });
    setShowDeleteModal(true);
  };
  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setImagePreviewVisible(true);
  };
  // Render activity item for FlatList - Only called when activities is defined and not empty
  const renderActivityItem = ({ item, index }) => (
    <View style={styles.activityRow}>
      <View style={[styles.activityCell, { flex: 2 }]}>
        <View style={styles.activityItemContent}>
          <View style={[styles.activityTypeIconContainer, { backgroundColor: getActivityGradient(item.type)[0] + '20' }]}>
            <MaterialCommunityIcons
              name={getActivityIcon(item.type)}
              size={16}
              color={getActivityGradient(item.type)[0]}
            />
          </View>
          <Text style={styles.cellText} numberOfLines={1}>
            {item?.description || 'Unknown activity'}
          </Text>
        </View>
      </View>
      <View style={[styles.activityCell, { flex: 1 }]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item?.timestamp || 'Unknown date'}
        </Text>
      </View>
      <View style={[styles.activityCell, { flex: 0.8, borderRightWidth: 0 }]}>
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => viewActivity(item)}
          >
            <Ionicons name="eye" size={16} color="#0984e3" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteActivity(index)}
          >
            <Ionicons name="trash" size={16} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  // Calculate responsive card dimensions based on screen width
  const currentWidth = dimensions.width;
  const cardSpacing = 9; // Space between cards
  const containerPadding = 15 * 2; // Left and right padding
  const interCardSpacingRow1 = cardSpacing * 2; // Space between 3 cards
  const interCardSpacingRow2 = cardSpacing; // Space between 2 cards
  // Calculate card width for 3 cards in first row
  const statsCardWidth = (currentWidth - containerPadding - interCardSpacingRow1) / 3;
  // Calculate card width for 2 cards in second row
  const widerCardWidth = (currentWidth - containerPadding - interCardSpacingRow2) / 2;
  // Calculate max visible activities (up to 6)
  const maxVisibleActivities = 5;
  const activityRowHeight = 50; // Height of each activity row
  // Function to reset activities data in AsyncStorage
  const resetActivitiesData = async () => {
    try {
      setLoading(true);
      // Sample activities - including your new Remove from Playlist entries
      const sampleActivities = [
        { 
          user: 'John Doe', 
          description: 'John Doe created playlist "Summer Vibes"', 
          type: 'Create Playlist',
          timestamp: '2025-04-13 14:32:05' 
        },
        { 
          user: 'Maria Garcia', 
          description: 'Maria Garcia added "Thinking Out Loud" to Favorites', 
          type: 'Add to Favorites',
          timestamp: '2025-04-13 12:15:22' 
        },
        { 
          user: 'Alex Smith', 
          description: 'Alex Smith logged in', 
          type: 'Login',
          timestamp: '2025-04-12 18:45:10' 
        },
        { 
          user: 'Emma Johnson', 
          description: 'Emma Johnson added "Shape of You" to playlist "Workout Mix"', 
          type: 'Add to Playlist',
          timestamp: '2025-04-12 10:21:33' 
        },
        { 
          user: 'James Wilson', 
          description: 'James Wilson registered a new account', 
          type: 'Register',
          timestamp: '2025-04-11 09:05:47' 
        },
        { 
          user: 'Sophie Brown', 
          description: 'Sophie Brown removed "Bad Guy" from Favorites', 
          type: 'Remove from Favorites',
          timestamp: '2025-04-11 08:12:30' 
        },
        { 
          user: 'David Kim', 
          description: 'David Kim logged out', 
          type: 'Logout',
          timestamp: '2025-04-10 22:45:18' 
        },
        { 
          user: 'Kim Bajan', 
          description: 'Kim Bajan removed "Bad Guy" from Playlist', 
          type: 'Remove from Playlist',
          timestamp: '2025-04-10 22:45:18' 
        },
        { 
          user: 'Linda Chen', 
          description: 'Linda Chen played "Blinding Lights"', 
          type: 'Play Music',
          timestamp: '2025-04-10 20:30:42' 
        }
      ];
      // Force overwrite the activities in AsyncStorage
      await AsyncStorage.setItem('activities', JSON.stringify(sampleActivities));
      // Update the activities state
      setActivities(sampleActivities);
      setLoading(false);
      // Show success message
      alert('Activities data has been reset successfully');
    } catch (err) {
      console.error('Error resetting activities data:', err);
      setLoading(false);
      alert('Failed to reset activities data');
    }
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderAdmin title="Dashboard" onMenuPress={toggleSidebar} navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <HeaderAdmin title="Dashboard" onMenuPress={toggleSidebar} navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchDashboardData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <HeaderAdmin title="Dashboard" onMenuPress={toggleSidebar} navigation={navigation} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Stats Cards Section */}
        <View style={styles.statsContainer}>
          {/* Row 1: Songs, Moods, Playlists */}
          <View style={styles.statsRow}>
            {/* Total Songs Card */}
            <TouchableOpacity 
              style={[styles.statsCard, { width: statsCardWidth }]}
              onPress={() => setSongsModalVisible(true)}
            >
              <LinearGradient
                 colors={['#ff7675', '#d63031']}
                style={styles.cardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <MaterialCommunityIcons name="music-note" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Total Songs</Text>
                  <Text style={styles.cardValue}>{stats.totalSongs}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            {/* Moods Card - With Modal Trigger */}
            <TouchableOpacity 
              style={[styles.statsCard, { width: statsCardWidth }]} 
              onPress={() => setMoodsModalVisible(true)}
            >
              <LinearGradient
                colors={['#1fa2ff', '#12d8fa']}
                style={styles.cardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <MaterialCommunityIcons name="emoticon-outline" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Moods</Text>
                  <Text style={styles.cardValue}>{stats.totalMoods}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            {/* Playlists Card */}
            <View style={[styles.statsCard, { width: statsCardWidth }]}>
              <LinearGradient
              colors={['#1dd1a1', '#10ac84']}
                style={styles.cardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <MaterialCommunityIcons name="playlist-music" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Playlist</Text>
                  <Text style={styles.cardValue}>{stats.totalPlaylists}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
          {/* Row 2: Listeners, Favorites */}
          <View style={styles.statsRow}>
            {/* Listeners Card */}
            <View style={[styles.statsCard, { width: widerCardWidth }]}>
              <LinearGradient
             colors={['#C084FC', '#EBAEFF']}
                style={styles.cardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Listeners</Text>
                  <Text style={styles.cardValue}>{stats.totalListeners}</Text>
                </View>
              </LinearGradient>
            </View>
            {/* Favorites Card */}
            <View style={[styles.statsCard, { width: widerCardWidth }]}>
              <LinearGradient
               colors={['#FFA500', '#FF6F00']}
                style={styles.cardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <MaterialCommunityIcons name="heart" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Favorites</Text>
                  <Text style={styles.cardValue}>{stats.totalFavorites}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
        {/* Recent Activities Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetActivitiesData}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityTable}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={[styles.headerCell, { flex: 2 }]}>
                <Text style={styles.headerText}>Activity</Text>
              </View>
              <View style={[styles.headerCell, { flex: 1 }]}>
                <Text style={styles.headerText}>Date/Time</Text>
              </View>
              <View style={[styles.headerCell, { flex: 0.8, borderRightWidth: 0 }]}>
                <Text style={styles.headerText}>Action</Text>
              </View>
            </View>
            {/* Table Body - Fixed height for 6 rows */}
            <View style={[styles.tableBody, { height: Math.min(Array.isArray(activities) ? (activities.length > 0 ? Math.min(activities.length, maxVisibleActivities) * activityRowHeight : activityRowHeight) : activityRowHeight, maxVisibleActivities * activityRowHeight) }]}>
              {!Array.isArray(activities) || activities.length === 0 ? (
                <View style={styles.emptyActivities}>
                  <View style={{ height: 40 }}>
                    <MaterialCommunityIcons 
                      name="clipboard-text-outline" 
                      size={24} 
                      color="#2c3e50" 
                      style={styles.emptyIcon} 
                    />
                  </View>
                  <Text style={styles.emptyText}>No activities found</Text>
                </View>
              ) : (
                <FlatList
                  data={activities}
                  renderItem={renderActivityItem}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  style={styles.activityList}
                  contentContainerStyle={styles.activityListContent}
                  showsVerticalScrollIndicator={true}
                  initialNumToRender={maxVisibleActivities}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Moods Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={moodsModalVisible}
        onRequestClose={() => setMoodsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Moods</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setMoodsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#2d3436" />
              </TouchableOpacity>
            </View>
            <View style={styles.moodsContainer}>
              {moodsList.length > 0 ? (
                moodsList.map((mood, index) => (
                  <View key={index} style={styles.moodCard}>
                    <LinearGradient
                      colors={[mood.color, shadeColor(mood.color, -20)]}
                      style={styles.moodCardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialCommunityIcons 
                        name={mood.icon} 
                        size={36} 
                        color="#fff" 
                        style={styles.moodIcon} 
                      />
                      <Text style={styles.moodName}>{mood.name}</Text>
                    </LinearGradient>
                  </View>
                ))
              ) : (
                <View style={styles.emptyMoodsContainer}>
                  <MaterialCommunityIcons 
                    name="emoticon-sad-outline" 
                    size={48} 
                    color="#95a5a6" 
                  />
                  <Text style={styles.emptyMoodsText}>No moods found. Add some music first!</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => setMoodsModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Songs Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={songsModalVisible}
        onRequestClose={() => setSongsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.songsModalContainer]}>
            <LinearGradient
              colors={['#ff7675', '#d63031']}
              style={styles.songsModalHeader}
            >
              <View style={styles.songsModalHeaderContent}>
                <MaterialCommunityIcons name="music-note" size={24} color="#fff" />
                <Text style={styles.songsModalTitle}>Music Library</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSongsModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <FlatList
              data={songsList}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.songsListContainer}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <MaterialCommunityIcons name="music-off" size={40} color="#95a5a6" />
                  <Text style={styles.emptyListText}>No songs available</Text>
                </View>
              )}
              renderItem={({ item, index }) => {
                // Process image URI
                const imageUri = getImageUrl(item.coverImage);
                console.log('Processed image URI:', imageUri);

                return (
                  <View style={styles.songItem}>
                    <View style={styles.songNumberContainer}>
                      <Text style={styles.songNumber}>
                        {(index + 1).toString().padStart(2, '0')}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.songImageContainer}
                      onPress={() => imageUri ? handleImagePress(item.coverImage) : null}
                    >
                      {imageUri ? (
                        <Image 
                          source={{ uri: imageUri }}
                          style={styles.songImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.songImagePlaceholder, { backgroundColor: 'rgba(111, 66, 193, 0.25)' }]}>
                          <LinearGradient
                            colors={['#C084FC', '#EBAEFF']}
                            style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}
                          >
                            <MaterialCommunityIcons 
                              name="music" 
                              size={22} 
                              color="#fff"
                              style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 3,
                              }}
                            />
                          </LinearGradient>
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.songInfo}>
                      <Text style={styles.songTitle} numberOfLines={1}>
                        {item.title || 'Untitled'}
                      </Text>
                      <Text style={styles.songArtist} numberOfLines={1}>
                        {item.artist || 'Unknown Artist'}
                      </Text>
                    </View>
                    <View style={styles.songCategoryContainer}>
                      <LinearGradient
                        colors={[
                          item.category === 'Happy' ? '#ffe066' :
                          item.category === 'Sad' ?  '#2196F3' :
                          item.category === 'Fun' ? '#f368e0' :
                          item.category === 'Strong' ? '#FF5722' :
                          item.category === 'Summer' ? '#ff9f43' :
                          '#a8a8a8',

                          shadeColor(
                            item.category === 'Happy' ? '#ffe066' :
                            item.category === 'Sad' ? '#2196F3' :
                            item.category === 'Fun' ? '#f368e0' :
                            item.category === 'Strong' ? '#FF5722' :
                            item.category === 'Summer' ? '#ff9f43' :
                            '#a8a8a8',
                            -20
                          )
                        ]}
                        style={styles.categoryGradient}
                      >
                        <Text style={styles.categoryLabel}>
                          {item.category || 'None'}
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Image Preview Modal */}
      <Modal
        visible={imagePreviewVisible}
        transparent={true}
        onRequestClose={() => setImagePreviewVisible(false)}
        animationType="fade"
      >
        <View style={styles.imagePreviewOverlay}>
          <TouchableOpacity 
            style={styles.imagePreviewCloseButton}
            onPress={() => setImagePreviewVisible(false)}
          >
            <Ionicons name="close-circle" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: getImageUrl(selectedImage) }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
      {/* Sidebar */}
      {isSidebarVisible && (
        <SidebarAdmin 
          navigation={navigation}
          isVisible={isSidebarVisible}
          onClose={toggleSidebar}
          activeScreen="DashboardScreen"
        />
      )}
      {/* Custom Activity Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertContainer}>
            {alertData && (
              <>
                <LinearGradient
                  colors={getActivityGradient(alertData.type)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.alertHeaderGradient}
                >
                  <View style={styles.alertHeaderContent}>
                    <View style={styles.alertIconContainer}>
                      <MaterialCommunityIcons 
                        name={getActivityIcon(alertData.type)} 
                        size={28} 
                        color="#fff" 
                      />
                    </View>
                    <View style={styles.alertTitleContainer}>
                      <Text style={styles.alertTitle}>
                        {alertData.type || 'Activity Details'}
                      </Text>
                      <Text style={styles.alertTimestamp}>
                        {alertData.timestamp || 'Unknown time'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
                <View style={styles.alertContent}>
                  <View style={styles.alertRow}>
                    <View style={styles.alertLabelContainer}>
                      <MaterialCommunityIcons name="account" size={18} color="#7f8c8d" style={styles.alertRowIcon} />
                      <Text style={styles.alertLabel}>User</Text>
                    </View>
                    <Text style={styles.alertValue}>{alertData.user || 'Unknown'}</Text>
                  </View>
                  <View style={styles.alertDivider} />
                  <View style={styles.alertRow}>
                    <View style={styles.alertLabelContainer}>
                      <MaterialCommunityIcons name="text-box-outline" size={18} color="#7f8c8d" style={styles.alertRowIcon} />
                      <Text style={styles.alertLabel}>Description</Text>
                    </View>
                  </View>
                  <Text style={styles.alertDescription}>{alertData.description || 'No description'}</Text>
                </View>
                <View style={styles.alertButtonRow}>
                  <TouchableOpacity 
                    style={styles.alertCloseButton}
                    onPress={() => setAlertVisible(false)}
                  >
                    <Text style={styles.alertCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setActivityToDelete(null);
        }}
        onDelete={async () => {
          try {
            const newActivities = Array.isArray(activities) ? [...activities] : [];
            newActivities.splice(activityToDelete.index, 1);
            setActivities(newActivities);
            await AsyncStorage.setItem('activities', JSON.stringify(newActivities));
            setShowDeleteModal(false);
            setActivityToDelete(null);
            setToastMessage('Activity deleted successfully');
            setShowToast(true);
          } catch (err) {
            console.error('Error deleting activity:', err);
            setToastMessage('Failed to delete activity');
            setShowToast(true);
          }
        }}
        title="this activity"
      />
      <ToastNotification
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  statsContainer: {
    marginVertical: 7,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  statsCard: {
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    minWidth: 100, // Prevent cards from getting too small
  },
  cardBackground: {
    flex: 1,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 10 : 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  activitySection: {
    marginTop: 15,
  },
  activityTable: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f2f6',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdde1',
  },
  headerCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#dcdde1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 300,
    minHeight: 50,
  },
  activityList: {
    width: '100%',
    flexGrow: 0,
  },
  activityListContent: {
    flexGrow: 1,
  },
  activityRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdde1',
    height: 50,
    alignItems: 'center',
  },
  activityCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#dcdde1',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  activityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityTypeIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  actionButton: {
    marginHorizontal: 5,
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
  emptyActivities: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  emptyIcon: {
    marginBottom: 7,
    position: 'relative',
    top: 5,
  },
  emptyText: {
    color: '#7f8c8d',
    textAlign: 'center',
    position: 'relative',
    bottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  closeButton: {
    padding: 5,
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 10,
  },
  moodCard: {
    width: '48%',
    height: 100,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moodCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  moodIcon: {
    marginBottom: 8,
  },
  moodName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyMoodsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyMoodsText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  alertHeaderGradient: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  alertHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  alertIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  alertTimestamp: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  alertContent: {
    padding: 20,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertLabel: {
    fontSize: 15,
    color: '#596275',
    fontWeight: '600',
  },
  alertValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  alertDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f1f2f6',
    marginVertical: 12,
  },
  alertDescription: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 20,
    paddingVertical: 5,
  },
  alertButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  alertCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3498db',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  alertCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertRowIcon: {
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  songsModalContainer: {
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 0,
  },
  songsModalHeader: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  songsModalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songsModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  songsListContainer: {
    paddingVertical: 15,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 60,
  },
  songNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(9, 132, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  songNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0984e3', // Rich blue
  },
  songImageContainer: {
    width: 38,
    height: 38,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  songImage: {
   width: '100%',
    height: '100%',
   //width: '48',
   // height: '48',
    borderRadius: 6,
  },
  songImagePlaceholder: {
    width: '100%',
    height: '100%',
    // width: '48',
    // height: '48',

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  songInfo: {
    flex: 1,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 12,
    color: '#636e72',
  },
  songCategoryContainer: {
    marginLeft: 'auto',
  },
  categoryGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyListText: {
    marginTop: 10,
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
  imagePreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewCloseButton: {
    position: 'absolute',
    top: 180,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  previewImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
export default DashboardScreen;