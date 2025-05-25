import { Platform } from 'react-native';

export const getValidImageSource = (imageUrl) => {
  if (!imageUrl) {
    return require('../../assets/images/wa5.png');
  }

  // Handle string URLs
  if (typeof imageUrl === 'string') {
    return { uri: imageUrl };
  }

  // Handle object with uri property
  if (imageUrl && typeof imageUrl === 'object' && imageUrl.uri) {
    return { uri: imageUrl.uri };
  }

  return require('../../assets/images/wa5.png');
};
