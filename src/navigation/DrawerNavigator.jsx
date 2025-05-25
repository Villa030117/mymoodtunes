import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../../app/HomeScreen';
import PlaylistScreen from '../../app/PlaylistScreen';
import FavoritesScreen from '../../app/FavoritesScreen';
import CategoryScreen from '../../app/CategoryScreen';
import MusicPlayerScreen from '../../app/MusicPlayerScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        {/* You can add a logo or user profile here */}
      </View>
      <DrawerItem
        label="Home"
        icon={({ color, size }) => (
          <Icon name="home" color="#1DB954" size={size} />
        )}
        onPress={() => props.navigation.navigate('Home')}
        labelStyle={styles.drawerLabel}
      />
      <DrawerItem
        label="Playlists"
        icon={({ color, size }) => (
          <Icon name="queue-music" color="#1DB954" size={size} />
        )}
        onPress={() => props.navigation.navigate('Playlists')}
        labelStyle={styles.drawerLabel}
      />
      <DrawerItem
        label="Favorites"
        icon={({ color, size }) => (
          <Icon name="favorite" color="#1DB954" size={size} />
        )}
        onPress={() => props.navigation.navigate('Favorites')}
        labelStyle={styles.drawerLabel}
      />
      <DrawerItem
        label="Categories"
        icon={({ color, size }) => (
          <Icon name="category" color="#1DB954" size={size} />
        )}
        onPress={() => props.navigation.navigate('Categories')}
        labelStyle={styles.drawerLabel}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#282828',
          width: 280,
        },
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Playlists" component={PlaylistScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="Categories" component={CategoryScreen} />
      <Drawer.Screen name="MusicPlayer" component={MusicPlayerScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#282828',
  },
  drawerHeader: {
    height: 150,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  drawerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default DrawerNavigator; 