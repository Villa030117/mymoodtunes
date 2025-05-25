import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet } from 'react-native';

// Admin Screens
import DashboardScreen from '../../app/DashboardScreen';
import UserLogsScreen from '../../app/UserLogsScreen';
import MusicManagementScreen from '../../app/MusicManagementScreen';
import FavoritesManagementScreen from '../../app/FavoritesManagementScreen';
import PlaylistManagementScreen from '../../app/PlaylistManagementScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom drawer content
const DrawerContent = props => {
  return (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.title}>MoodTunes Admin</Text>
      </View>
      {props.children}
    </View>
  );
};

const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerActiveTintColor: '#3566b1',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
          fontWeight: '500',
        },
        drawerIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'UserLogs') {
            iconName = 'people';
          } else if (route.name === 'MusicManagement') {
            iconName = 'library-music';
          } else if (route.name === 'FavoritesManagement') {
            iconName = 'favorite';
          } else if (route.name === 'PlaylistManagement') {
            iconName = 'queue-music';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen 
        name="UserLogs" 
        component={UserLogsScreen} 
        options={{ title: 'User Logs' }}
      />
      <Drawer.Screen 
        name="MusicManagement" 
        component={MusicManagementScreen} 
        options={{ title: 'Music Management' }}
      />
      <Drawer.Screen 
        name="FavoritesManagement" 
        component={FavoritesManagementScreen} 
        options={{ title: 'Favorites Management' }}
      />
      <Drawer.Screen 
        name="PlaylistManagement" 
        component={PlaylistManagementScreen} 
        options={{ title: 'Playlist Management' }}
      />
    </Drawer.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMain" component={AdminDrawer} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    paddingVertical: 40,
    paddingHorizontal: 15,
    backgroundColor: '#3566b1',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AdminNavigator;
