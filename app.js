import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { MusicProvider } from './src/context/MusicContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <MusicProvider>
          <ThemeProvider>
            <AppNavigator />
          </ThemeProvider>
        </MusicProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;