import React, { useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Platform,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.7;

const Sidebar = ({ visible, onClose }) => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

  const menuItems = [
    { name: 'Home', icon: 'home', route: 'Home' },
    { name: 'Playlists', icon: 'queue-music', route: 'Playlists' },
    { name: 'Favorites', icon: 'favorite', route: 'Favorites' },
  ];

  // Pan responder for swipe to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow swiping to the right (positive dx)
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SIDEBAR_WIDTH / 3) {
          // User swiped enough to close
          closeDrawer();
        } else {
          // Return to open position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      closeDrawer();
    }
  }, [visible]);

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleNavigate = (route) => {
    if (route === 'Home' && navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      navigation.navigate(route);
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Landing');
    onClose();
  };

  const pickImage = async (source) => {
    try {
      let result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      if (!result.canceled && result.assets.length > 0) {
        updateUserProfile({ profilePic: result.assets[0].uri });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.closeArea} onPress={onClose} />
        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.sidebar, 
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => user && pickImage('gallery')}
            >
              {user?.profilePic ? (
                <Image source={{ uri: user.profilePic }} style={styles.avatar} />
              ) : (
                <Icon name="person" size={60} color="#ccc" />
              )}
            </TouchableOpacity>
            <Text style={styles.username}>{user ? user.username : 'Guest'}</Text>
          </View>

          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <Icon name={item.icon} size={24} color="#555" />
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}

            {user ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Icon name="logout" size={24} color="#e74c3c" />
                <Text style={[styles.menuText, { color: '#e74c3c' }]}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Login')}>
                <Icon name="login" size={24} color="#3498db" />
                <Text style={styles.menuText}>Login / Signup</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    justifyContent: 'flex-end', // Position content at the right side
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: SIDEBAR_WIDTH,
    bottom: 0,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 30, // Changed from right to left
    borderBottomLeftRadius: 30, // Changed from right to left
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 }, // Shadow on the left side now
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#555',
  },
});

export default Sidebar;