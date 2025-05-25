import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastNotification = ({ visible, message, type = 'success', duration = 1500, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Automatically hide after duration
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onHide) onHide();
        });
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, duration, onHide]);
  
  if (!visible) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#fff" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="#fff" />;
      case 'warning':
        return <Ionicons name="warning" size={24} color="#fff" />;
      case 'info':
        return <Ionicons name="information-circle" size={24} color="#fff" />;
      default:
        return <Ionicons name="checkmark-circle" size={24} color="#fff" />;
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FFC107';
      case 'info': return '#2196F3';
      default: return '#4CAF50';
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          backgroundColor: getBackgroundColor(),
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 45,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 9999,
    maxWidth: '90%',
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default ToastNotification; 