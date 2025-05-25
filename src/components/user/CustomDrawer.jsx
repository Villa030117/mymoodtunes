import React, { useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');
const ACCENT_COLOR = '#1877F2'; // Facebook blue

const CustomDrawer = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Animation for sliding in/out
  const slideAnim = useRef(new Animated.Value(visible ? 0 : -width)).current;
  
  // Setup pan responder for swipe to close - only for swiping right
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only for closing - swiping right
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 80) {
          // User swiped right enough to close
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
  
  React.useEffect(() => {
    if (visible) {
      // Instantly appear, no slide-in animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 10, // Very short duration to make it appear instantly
        useNativeDriver: true,
      }).start();
    } 
  }, [visible, slideAnim]);
  
  const closeDrawer = () => {
    // Close animation with a slide-out to the right
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };
  
  const navigateTo = (screen) => {
    closeDrawer();
    navigation.navigate(screen);
  };

  // Mouse hover handlers for web
  const handleMouseEnter = (itemName) => {
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeDrawer}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.closeArea} 
          activeOpacity={1}
          onPress={closeDrawer} 
        />
        
        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.drawer,
            { 
              transform: [
                { translateX: slideAnim },
                { perspective: 1000 }
              ],
            }
          ]}
        >
          <View style={styles.drawerContent}>
            {/* Header with profile */}
            <View style={styles.header}>
              <View style={styles.profileSection}>
                <View style={styles.profileIcon}>
                  <Icon name="person" size={40} color={ACCENT_COLOR} />
                </View>
                <Text style={styles.headerText}>
                  {user ? user.username : 'MoodTunes'}
                </Text>
              </View>
            </View>
            
            {/* Menu items with hover effect */}
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  hoveredItem === 'home' && styles.menuItemHovered
                ]}
                onPress={() => navigateTo('HomeScreen')}
                onMouseEnter={() => handleMouseEnter('home')}
                onMouseLeave={handleMouseLeave}
              >
                <View style={[
                  styles.iconContainer,
                  hoveredItem === 'home' && styles.iconContainerHovered
                ]}>
                  <Icon name="home" size={24} color={hoveredItem === 'home' ? '#FFFFFF' : ACCENT_COLOR} />
                </View>
                <Text style={[
                  styles.menuText,
                  hoveredItem === 'home' && styles.menuTextHovered
                ]}>Home</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  hoveredItem === 'playlists' && styles.menuItemHovered
                ]}
                onPress={() => navigateTo('PlaylistScreen')}
                onMouseEnter={() => handleMouseEnter('playlists')}
                onMouseLeave={handleMouseLeave}
              >
                <View style={[
                  styles.iconContainer,
                  hoveredItem === 'playlists' && styles.iconContainerHovered
                ]}>
                  <Icon name="queue-music" size={24} color={hoveredItem === 'playlists' ? '#FFFFFF' : ACCENT_COLOR} />
                </View>
                <Text style={[
                  styles.menuText,
                  hoveredItem === 'playlists' && styles.menuTextHovered
                ]}>Playlists</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  hoveredItem === 'favorites' && styles.menuItemHovered
                ]}
                onPress={() => navigateTo('FavoritesScreen')}
                onMouseEnter={() => handleMouseEnter('favorites')}
                onMouseLeave={handleMouseLeave}
              >
                <View style={[
                  styles.iconContainer,
                  hoveredItem === 'favorites' && styles.iconContainerHovered
                ]}>
                  <Icon name="favorite" size={24} color={hoveredItem === 'favorites' ? '#FFFFFF' : ACCENT_COLOR} />
                </View>
                <Text style={[
                  styles.menuText,
                  hoveredItem === 'favorites' && styles.menuTextHovered
                ]}>Favorites</Text>
              </TouchableOpacity>
              
              {!user && (
                <TouchableOpacity 
                  style={[
                    styles.menuItem,
                    hoveredItem === 'login' && styles.menuItemHovered
                  ]}
                  onPress={() => navigateTo('LoginScreen')}
                  onMouseEnter={() => handleMouseEnter('login')}
                  onMouseLeave={handleMouseLeave}
                >
                  <View style={[
                    styles.iconContainer,
                    hoveredItem === 'login' && styles.iconContainerHovered
                  ]}>
                    <Icon name="login" size={24} color={hoveredItem === 'login' ? '#FFFFFF' : ACCENT_COLOR} />
                  </View>
                  <Text style={[
                    styles.menuText,
                    hoveredItem === 'login' && styles.menuTextHovered
                  ]}>Log In</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>MoodTunes v1.0</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeArea: {
    flex: 1,
  },
  drawer: {
    width: 230,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
    transform: [{ translateX: 0 }, { perspective: 1000 }],
  },
  drawerContent: {
    flex: 1,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    height: 150,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 12,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  menuItemHovered: {
    backgroundColor: ACCENT_COLOR,
    transform: [{scale: 1.03}],
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(24, 119, 242, 0.12)', // Facebook blue background for icons
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    transition: 'all 0.3s ease',
  },
  iconContainerHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    transition: 'all 0.2s ease',
  },
  menuTextHovered: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default CustomDrawer; 