import { DrawerActions } from '@react-navigation/native';
import { navigationRef } from '../../app';

// Helper to toggle the drawer from anywhere
export const toggleDrawer = () => {
  try {
    if (navigationRef.current) {
      navigationRef.current.dispatch(DrawerActions.toggleDrawer());
    }
  } catch (error) {
    console.log('Navigation error:', error);
  }
};

// Navigate to a screen within the drawer
export const navigateWithinDrawer = (routeName, params) => {
  try {
    if (navigationRef.current) {
      navigationRef.current.navigate('App', {
        screen: routeName,
        params
      });
    }
  } catch (error) {
    console.log('Navigation error:', error);
  }
};

// Navigate to the home screen
export const navigateToHome = () => {
  navigateWithinDrawer('HomeScreen');
};

// Go back to previous screen
export const goBack = () => {
  try {
    if (navigationRef.current) {
      navigationRef.current.goBack();
    }
  } catch (error) {
    console.log('Navigation error:', error);
    // Default to home if going back fails
    navigateToHome();
  }
}; 