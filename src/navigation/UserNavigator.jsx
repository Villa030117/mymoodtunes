/*import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../../app/HomeScreen';
import MusicPlayerScreen from '../../app/MusicPlayerScreen';
import PlaylistScreen from '../../app/PlaylistScreen';
import PlaylistViewScreen from '../../app/PlaylistViewScreen';
import EditPlaylistScreen from '../../app/EditPlaylistScreen';
import FavoritesScreen from '../../app/FavoritesScreen';
import CategoryScreen from '../../app/CategoryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simplified stack navigators
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
    <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
  </Stack.Navigator>
);

const PlaylistStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PlaylistMain" component={PlaylistScreen} />
    <Stack.Screen name="PlaylistView" component={PlaylistViewScreen} />
    <Stack.Screen name="EditPlaylist" component={EditPlaylistScreen} />
    <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
    <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
  </Stack.Navigator>
);

// Main tab navigator
const UserNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Playlists') {
          iconName = 'queue-music';
        } else if (route.name === 'Favorites') {
          iconName = 'favorite';
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3566b1',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        paddingBottom: 5,
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Playlists" component={PlaylistStack} />
    <Tab.Screen name="Favorites" component={FavoritesStack} />
  </Tab.Navigator>
);

export default UserNavigator;*/

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../../app/HomeScreen';
import MusicPlayerScreen from '../../app/MusicPlayerScreen';
import PlaylistScreen from '../../app/PlaylistScreen';
import PlaylistViewScreen from '../../app/PlaylistViewScreen';
import EditPlaylistScreen from '../../app/EditPlaylistScreen';
import FavoritesScreen from '../../app/FavoritesScreen';
import CategoryScreen from '../../app/CategoryScreen';

// Mood Screens
import SadMoodScreen from '../../app/SadMoodScreen';
import HappyMoodScreen from '../../app/HappyMoodScreen';
import FunMoodScreen from '../../app/FunMoodScreen';
import StrongMoodScreen from '../../app/StrongMoodScreen';
import SummerMoodScreen from '../../app/SummerMoodScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simplified stack navigators
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
    <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
    <Stack.Screen name="SadMoodScreen" component={SadMoodScreen} />
    <Stack.Screen name="HappyMoodScreen" component={HappyMoodScreen} />
    <Stack.Screen name="FunMoodScreen" component={FunMoodScreen} />
    <Stack.Screen name="StrongMoodScreen" component={StrongMoodScreen} />
    <Stack.Screen name="SummerMoodScreen" component={SummerMoodScreen} />
  </Stack.Navigator>
);

const PlaylistStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PlaylistMain" component={PlaylistScreen} />
    <Stack.Screen name="PlaylistView" component={PlaylistViewScreen} />
    <Stack.Screen name="EditPlaylist" component={EditPlaylistScreen} />
    <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
    <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
  </Stack.Navigator>
);

// Main tab navigator
const UserNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Playlists') {
          iconName = 'queue-music';
        } else if (route.name === 'Favorites') {
          iconName = 'favorite';
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3566b1',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        paddingBottom: 5,
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Playlists" component={PlaylistStack} />
    <Tab.Screen name="Favorites" component={FavoritesStack} />
  </Tab.Navigator>
);

export default UserNavigator;
