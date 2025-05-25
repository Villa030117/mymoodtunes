import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDistance } from 'date-fns';

const UserLogCard = ({ log }) => {
  // Define icon based on action type
  const getActionIcon = (action) => {
    switch (action) {
      case 'login':
        return 'login';
      case 'signup':
        return 'person-add';
      case 'add_favorite':
        return 'favorite';
      case 'remove_favorite':
        return 'favorite-border';
      case 'add_playlist':
        return 'playlist-add';
      case 'create_playlist':
        return 'library-add';
      case 'edit_playlist':
        return 'edit';
      default:
        return 'history';
    }
  };

  const timeAgo = formatDistance(new Date(log.timestamp), new Date(), { addSuffix: true });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={getActionIcon(log.action)} size={20} color="#666" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.username}>{log.username}</Text>
        <Text style={styles.action}>{log.description}</Text>
        <Text style={styles.timestamp}>{timeAgo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  action: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});

export default UserLogCard;