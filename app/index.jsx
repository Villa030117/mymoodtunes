import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const LandingPage = () => {
  const navigation = useNavigation();
  const [buttonScale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleContinue = () => {
    navigation.navigate('DashboardScreen');
    // navigation.navigate('HomeScreen');
  };

  return (
    <LinearGradient 
      colors={['#1a73e8', '#4285f4', '#5c9cfa']} 
      style={styles.container}
    >
      <StatusBar backgroundColor="#1a73e8" barStyle="light-content" />

      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assets/images/em.png')} 
            style={styles.emoji} 
            resizeMode="contain"
          />
          <Text style={styles.title}>MoodTunes</Text>
        </View>
        <Text style={styles.subtitle}>Track your mood,{'\n'}Tune your day</Text>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            { transform: [{ scale: buttonScale }] }
          ]}
        >
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emoji: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8', // Google Blue
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  arrowIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LandingPage;