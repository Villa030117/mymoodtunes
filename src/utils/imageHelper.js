import { Platform } from 'react-native';

export const normalizeImageUri = (imagePath) => {
  try {
    if (!imagePath) {
      return null;
    }

    // If it's already a valid URI, return it
    if (typeof imagePath === 'string' && 
       (imagePath.startsWith('file://') || 
        imagePath.startsWith('content://') ||
        imagePath.startsWith('data:') ||
        imagePath.startsWith('http'))) {
      return imagePath;
    }

    // If it's an object with uri property
    if (imagePath && typeof imagePath === 'object' && imagePath.uri) {
      return imagePath.uri;
    }

    // For other string paths
    if (typeof imagePath === 'string') {
      if (Platform.OS === 'web') {
        return imagePath.startsWith('file://') ? imagePath.slice(7) : imagePath;
      }
      return imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`;
    }

    return null;
  } catch (error) {
    console.error('Error normalizing image URI:', error);
    return null;
  }
};
