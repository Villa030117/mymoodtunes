import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

const ActivityCard = ({ activity }) => {
  // Define icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return 'login';
      case 'signup':
        return 'person-add';
      case 'add_song':
        return 'add';
      case 'delete_song':
        return 'delete';
      case 'edit_song':
        return 'edit';
      case 'add_to_favorites':
        return 'favorite';
      case 'add_to_playlist':
        return 'playlist-add';
      case 'create_playlist':
        return 'playlist-add-check';
      default:
        return 'notifications';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: activity.color || '#e6f2ff' }]}>
        <Icon name={getActivityIcon(activity.type)} size={18} color={activity.iconColor || '#0066cc'} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{activity.message}</Text>
        <Text style={styles.time}>{format(new Date(activity.timestamp), 'h:mm a')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#888',
  },
});

export default ActivityCard;
