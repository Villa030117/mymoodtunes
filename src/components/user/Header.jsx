/*
// src/components/user/Header.jsx
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomDrawer from './CustomDrawer';

// Match the Facebook blue color used in CustomDrawer
const ACCENT_COLOR = '#1877F2'; 

const Header = ({ title, showBack, showHome }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);

  const handleHomePress = () => {
    navigation.navigate('HomeScreen');
  };

  const handleMenuPress = () => {
    setDrawerVisible(true);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleHomePress} style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/em3.png')} 
              style={styles.logo}
            />
          </TouchableOpacity>

          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Icon name="arrow-back" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}

          {showHome && (
            <TouchableOpacity onPress={handleHomePress} style={styles.iconButton}>
              <Icon name="home" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}

          <Text style={styles.headerText}>
            {title || (user ? `Hi ${user.username}, welcome to ` : 'Hi, welcome to ')}
            <Text style={styles.moodTunesText}>MoodTunes!</Text>
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleMenuPress} 
          style={[
            styles.menuButton,
            menuHovered && styles.menuButtonHovered
          ]}
          onMouseEnter={() => setMenuHovered(true)}
          onMouseLeave={() => setMenuHovered(false)}
        >
          <Icon 
            name="menu" 
            size={25} 
            color={menuHovered ? '#FFFFFF' : ACCENT_COLOR} 
          /> 
        </TouchableOpacity>
      </View>

      <CustomDrawer 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
    elevation: 6,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
  moodTunesText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    textShadow: '1px 1px 1.5px rgba(24, 119, 242, 0.2)',
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0 2px 1.5px rgba(0, 0, 0, 0.07)',
    elevation: 5,
    transform: [{ scale: 1 }],
    marginLeft: 'auto',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  },
  menuButtonHovered: {
    backgroundColor: ACCENT_COLOR,
    transform: [{ scale: 1.05 }],
    boxShadow: '0 2px 3px rgba(24, 119, 242, 0.15)',
  },
});

export default Header; */

/*
// src/components/user/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomDrawer from './CustomDrawer';

// Match the Facebook blue color used in CustomDrawer
const ACCENT_COLOR = '#1877F2'; 

const Header = ({ title, showBack, showHome }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  
  // Create animation value here instead of using useRef
  const [bounceAnim] = useState(new Animated.Value(0));

  const handleHomePress = () => {
    navigation.navigate('HomeScreen');
  };

  const handleMenuPress = () => {
    setDrawerVisible(true);
  };
  
  // Start animation when component mounts
  useEffect(() => {
    startBounceAnimation();
    
    // Make sure animation continues even if component re-renders
    return () => {
      bounceAnim.setValue(0);
    };
  }, []);
  
  // Separate function to manage animation
  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 400,
          easing: Easing.out(Easing.sine),
          useNativeDriver: Platform.OS !== 'web', // Critical fix for web
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.sine),
          useNativeDriver: Platform.OS !== 'web', // Critical fix for web
        })
      ])
    ).start();
  };

  // Create the animated style
  const animatedStyle = {
    transform: [{ translateY: bounceAnim }]
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleHomePress} style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/em3.png')} 
              style={styles.logo}
            />
          </TouchableOpacity>

          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Icon name="arrow-back" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}

          {showHome && (
            <TouchableOpacity onPress={handleHomePress} style={styles.iconButton}>
              <Icon name="home" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              {title || (user ? `Hi ${user.username}, welcome to ` : 'Hi, welcome to ')}
            </Text>
            <Animated.Text style={[styles.moodTunesText, animatedStyle]}>
              MoodTunes!
            </Animated.Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleMenuPress} 
          style={[
            styles.menuButton,
            menuHovered && styles.menuButtonHovered
          ]}
          onMouseEnter={() => setMenuHovered(true)}
          onMouseLeave={() => setMenuHovered(false)}
        >
          <Icon 
            name="menu" 
            size={25} 
            color={menuHovered ? '#FFFFFF' : ACCENT_COLOR} 
          /> 
        </TouchableOpacity>
      </View>

      <CustomDrawer 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 6,
      }
    }),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 16,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  moodTunesText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    ...Platform.select({
      web: {
        textShadow: '1px 1px 1.5px rgba(24, 119, 242, 0.2)',
      },
    }),
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 1.5px rgba(0, 0, 0, 0.07)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      },
      default: {
        elevation: 5,
      }
    }),
    transform: [{scale: 1}],
    marginLeft: 'auto',
  },
  menuButtonHovered: {
    backgroundColor: ACCENT_COLOR,
    transform: [{scale: 1.05}],
    ...Platform.select({
      web: {
        boxShadow: '0 2px 3px rgba(24, 119, 242, 0.15)',
      },
    }),
  },
});

export default Header; */

// src/components/user/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomDrawer from './CustomDrawer';

// Match the Facebook blue color used in CustomDrawer
const ACCENT_COLOR = '#1877F2'; 

const Header = ({ title, showBack, showHome }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  
  // Create animation value
  const [bounceAnim] = useState(new Animated.Value(0));

  const handleHomePress = () => {
    navigation.navigate('HomeScreen');
  };

  const handleMenuPress = () => {
    setDrawerVisible(true);
  };
  
  // Start animation when component mounts
  useEffect(() => {
    startBounceAnimation();
    
    // Make sure animation continues even if component re-renders
    return () => {
      bounceAnim.setValue(0);
    };
  }, []);
  
  // Separate function to manage animation - simpler version without complex easing
  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 400,
          useNativeDriver: Platform.OS !== 'web', // False for web
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: Platform.OS !== 'web', // False for web
        })
      ])
    ).start();
  };

  // Create the animated style
  const animatedStyle = {
    transform: [{ translateY: bounceAnim }]
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleHomePress} style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/em3.png')} 
              style={styles.logo}
            />
          </TouchableOpacity>

          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Icon name="arrow-back" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}

          {showHome && (
            <TouchableOpacity onPress={handleHomePress} style={styles.iconButton}>
              <Icon name="home" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              {title || (user ? `Hi ${user.username}, welcome to ` : 'Hi, welcome to ')}
            </Text>
            <Animated.Text style={[styles.moodTunesText, animatedStyle]}>
              MoodTunes!
            </Animated.Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleMenuPress} 
          style={[
            styles.menuButton,
            menuHovered && styles.menuButtonHovered
          ]}
          onMouseEnter={() => setMenuHovered(true)}
          onMouseLeave={() => setMenuHovered(false)}
        >
          <Icon 
            name="menu" 
            size={25} 
            color={menuHovered ? '#FFFFFF' : ACCENT_COLOR} 
          /> 
        </TouchableOpacity>
      </View>

      <CustomDrawer 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 6,
      }
    }),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 16,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  moodTunesText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    ...Platform.select({
      web: {
        textShadow: '1px 1px 1.5px rgba(24, 119, 242, 0.2)',
      },
    }),
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 1.5px rgba(0, 0, 0, 0.07)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      },
      default: {
        elevation: 5,
      }
    }),
    transform: [{scale: 1}],
    marginLeft: 'auto',
  },
  menuButtonHovered: {
    backgroundColor: ACCENT_COLOR,
    transform: [{scale: 1.05}],
    ...Platform.select({
      web: {
        boxShadow: '0 2px 3px rgba(24, 119, 242, 0.15)',
      },
    }),
  },
});

export default Header;