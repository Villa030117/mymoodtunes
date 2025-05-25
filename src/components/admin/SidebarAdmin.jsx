import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, PanResponder, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SIDEBAR_WIDTH = 220; // Fixed width of 210
const SCREEN_WIDTH = Dimensions.get('window').width;

const SidebarAdmin = ({ navigation, isVisible, onClose, activeScreen }) => {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -SIDEBAR_WIDTH / 3) {
          closeDrawer();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'grid',
      route: 'DashboardScreen'
    },
    {
      title: 'User Logs',
      icon: 'people',
      route: 'UserLogsScreen'
    },
    {
      title: 'Music Management',
      icon: 'musical-note',
      route: 'MusicManagementScreen'
    },
    {
      title: 'Favorites Management',
      icon: 'heart',
      route: 'FavoritesManagementScreen'
    },
    {
      title: 'Playlist Management',
      icon: 'list',
      route: 'PlaylistManagementScreen'
    }
  ];

  const handleNavigation = (route) => {
    if (onClose) onClose();
    if (navigation) {
      setTimeout(() => {
        navigation.navigate(route);
      }, 300);
    }
  };

  const handleLogout = () => {
    if (onClose) onClose();
    if (navigation) {
      setTimeout(() => {
        navigation.navigate('LoginScreen');
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.backdrop,
          { opacity: backdropOpacity }
        ]}
        onTouchStart={closeDrawer}
      />
      
      <Animated.View 
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnim }] }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollContent}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Image 
                source={require('../../../assets/images/em.png')} 
                style={styles.appLogo} 
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.appNameContainer}>
            <Text style={styles.appNameText}>MoodTunes</Text>
          </View>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                activeScreen === item.route && styles.activeMenuItem
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              {activeScreen === item.route && (
                <View style={styles.activeIndicator} />
              )}
              <Ionicons
                name={item.icon}
                size={20}
                color={activeScreen === item.route ? '#ffffff' : '#e6e6e6'}
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuText,
                  activeScreen === item.route && styles.activeMenuText
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1877f2',
    paddingTop: 0,
    paddingBottom: 15,
    zIndex: 1001,
    justifyContent: 'space-between',
    flexDirection: 'column',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scrollContent: {
    flex: 1,
    
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  appLogo: {
    width: '100%',
    height: '100%',
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 8,
  },
  appNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 8,
    position: 'relative',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#e6e6e6',
  },
  activeMenuText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 8,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#ffffff',
  },
});

export default SidebarAdmin;
