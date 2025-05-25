import React, { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

// Initial state
const initialState = {
  isAuthenticated: false,
  userInfo: null,
  isLoading: false,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { 
        ...state, 
        isLoading: true, 
        error: null 
      };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        userInfo: action.payload, 
        isLoading: false,
        error: null 
      };
    case 'AUTH_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...initialState 
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Actions
  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_REQUEST' });
      const response = await authService.login(email, password);
      
      // Save to storage
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: response.user 
      });
      
      return response.user;
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error.response?.data?.message || 'Failed to login' 
      });
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'AUTH_REQUEST' });
      const response = await authService.signup(userData);
      
      // Automatically login after signup
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: response.user 
      });
      
      return response.user;
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error.response?.data?.message || 'Failed to sign up' 
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const loadStoredAuth = async () => {
    try {
      dispatch({ type: 'AUTH_REQUEST' });
      const userToken = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      
      if (userToken && userInfo) {
        // Validate token with the server
        await authService.validateToken(userToken);
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: JSON.parse(userInfo) 
        });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      // Token invalid or expired
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      login, 
      signup, 
      logout,
      loadStoredAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};