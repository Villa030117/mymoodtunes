import { getPlaylists, storePlaylists, deletePlaylist as deletePlaylistFromStorage } from '../utils/storage';

// Get user playlists
const getUserPlaylists = async () => {
  try {
    return await getPlaylists();
  } catch (error) {
    throw handleError(error);
  }
};

// Error handler
const handleError = (error) => {
  return {
    message: error.message || 'An error occurred',
    status: 500
  };
};

// Delete playlist
const deletePlaylist = async (playlistId) => {
  try {
    const success = await deletePlaylistFromStorage(playlistId);
    if (success) {
      return { message: 'Playlist deleted successfully' };
    }
    throw new Error('Failed to delete playlist');
  } catch (error) {
    throw handleError(error);
  }
};

const playlistService = {
  getUserPlaylists,
  deletePlaylist
};

export default playlistService;