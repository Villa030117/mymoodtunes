 // Format time in seconds to mm:ss format
export const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date to readable format
  export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format date with time
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Format number with commas
  export const formatNumber = (num) => {
    if (isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  };
  
  // Format user activity for logs
  export const formatUserActivity = (activity) => {
    if (!activity) return '';
    
    const { type, user, targetName, createdAt } = activity;
    const date = formatDateTime(createdAt);
    
    switch (type) {
      case 'LOGIN':
        return `${user.username} logged in to MoodTunes - ${date}`;
      case 'SIGNUP':
        return `${user.username} created a new account - ${date}`;
      case 'ADD_FAVORITE':
        return `${user.username} added "${targetName}" to favorites - ${date}`;
      case 'REMOVE_FAVORITE':
        return `${user.username} removed "${targetName}" from favorites - ${date}`;
      case 'CREATE_PLAYLIST':
        return `${user.username} created playlist "${targetName}" - ${date}`;
      case 'UPDATE_PLAYLIST':
        return `${user.username} updated playlist "${targetName}" - ${date}`;
      case 'ADD_TO_PLAYLIST':
        return `${user.username} added a song to "${targetName}" playlist - ${date}`;
      case 'REMOVE_FROM_PLAYLIST':
        return `${user.username} removed a song from "${targetName}" playlist - ${date}`;
      default:
        return `${user.username} performed an action - ${date}`;
    }
  };
  
  // Format error response
  export const formatErrorResponse = (error) => {
    if (!error) return 'An unknown error occurred';
    
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unknown error occurred';
  };
  
  // Get emoji for mood category
  export const getMoodEmoji = (mood) => {
    switch (mood.toLowerCase()) {
      case 'sad':
        return '😢';
      case 'strong':
      case 'motivation':
        return '💪';
      case 'happy':
        return '😊';
      case 'fun':
      case 'party':
        return '🎉';
      case 'summer':
        return '🌞';
      default:
        return '🎵';
    }
  };
  
  // Get mood category from emoji
  export const getMoodFromEmoji = (emoji) => {
    switch (emoji) {
      case '😢':
        return 'sad';
        case '💪':
            return 'strong';
          case '😊':
            return 'happy';
          case '🎉':
            return 'fun';
          case '🌞':
            return 'summer';
          default:
            return 'unknown';
        }
      };
      
      // Convert milliseconds to a human-readable duration (e.g., "1h 20m 15s")
      export const formatDuration = (milliseconds) => {
        if (isNaN(milliseconds) || milliseconds < 0) return '0s';
        
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
      
        return [
          hours > 0 ? `${hours}h` : '',
          minutes > 0 ? `${minutes}m` : '',
          seconds > 0 ? `${seconds}s` : ''
        ].filter(Boolean).join(' ');
      };
      
      // Convert bytes to a human-readable file size (e.g., "2.5 MB")
      export const formatFileSize = (bytes) => {
        if (isNaN(bytes) || bytes < 0) return '0 B';
      
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0;
      
        while (bytes >= 1024 && i < units.length - 1) {
          bytes /= 1024;
          i++;
        }
      
        return `${bytes.toFixed(1)} ${units[i]}`;
      };
      
      // Capitalize the first letter of each word in a string
      export const capitalizeWords = (str) => {
        if (!str) return '';
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
      };
      
