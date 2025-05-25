/*import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuth from '../hooks/useAuth';

// Screens
import LandingScreen from '../../app/index';
import HomeScreen from '../../app/HomeScreen';
import PlaylistScreen from '../../app/PlaylistScreen';
import FavoritesScreen from '../../app/FavoritesScreen';
import LoginScreen from '../../app/LoginScreen';
import SignupScreen from '../../app/SignupScreen';
import MusicPlayerScreen from '../../app/MusicPlayerScreen';
import PlaylistViewScreen from '../../app/PlaylistViewScreen';
import EditPlaylistScreen from '../../app/EditPlaylistScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { authState, loadStoredAuth } = useAuth();
  
  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
      <Stack.Screen name="PlaylistView" component={PlaylistViewScreen} />
      <Stack.Screen name="EditPlaylist" component={EditPlaylistScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;*/

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuth from '../hooks/useAuth';

// Screens
import LandingScreen from '../../app/index';
import HomeScreen from '../../app/HomeScreen';
import PlaylistScreen from '../../app/PlaylistScreen';
import FavoritesScreen from '../../app/FavoritesScreen';
import LoginScreen from '../../app/LoginScreen';
import SignupScreen from '../../app/SignupScreen';
import MusicPlayerScreen from '../../app/MusicPlayerScreen';
import PlaylistViewScreen from '../../app/PlaylistViewScreen';
import EditPlaylistScreen from '../../app/EditPlaylistScreen';
import CategoryScreen from '../../app/CategoryScreen';

// Mood Screens
import SadMoodScreen from '../../app/SadMoodScreen';
import HappyMoodScreen from '../../app/HappyMoodScreen';
import FunMoodScreen from '../../app/FunMoodScreen';
import StrongMoodScreen from '../../app/StrongMoodScreen';
import SummerMoodScreen from '../../app/SummerMoodScreen';

// Admin Screens
import DashboardScreen from '../../app/DashboardScreen';
import UserLogsScreen from '../../app/UserLogsScreen';
import MusicManagementScreen from '../../app/MusicManagementScreen';
import FavoritesManagementScreen from '../../app/FavoritesManagementScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { authState, loadStoredAuth } = useAuth();

  useEffect(() => {
    loadStoredAuth();
  }, []);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
      <Stack.Screen name="PlaylistView" component={PlaylistViewScreen} />
      <Stack.Screen name="EditPlaylist" component={EditPlaylistScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      
      {/* Mood Screens */}
      <Stack.Screen name="SadMoodScreen" component={SadMoodScreen} />
      <Stack.Screen name="HappyMoodScreen" component={HappyMoodScreen} />
      <Stack.Screen name="FunMoodScreen" component={FunMoodScreen} />
      <Stack.Screen name="StrongMoodScreen" component={StrongMoodScreen} />
      <Stack.Screen name="SummerMoodScreen" component={SummerMoodScreen} />
      
      {/* Admin Screens */}
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="UserLogsScreen" component={UserLogsScreen} />
      <Stack.Screen name="MusicManagementScreen" component={MusicManagementScreen} />
      <Stack.Screen name="FavoritesManagementScreen" component={FavoritesManagementScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
