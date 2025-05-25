import useAxios from '../hooks/useAxios';

// This is a function that returns an object with methods
// Instead of being a hook itself, it uses the useAxios hook
const createUserService = () => {
  const axios = useAxios();

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user profile' 
      };
    }
  };

  // Get user favorite songs
  const getUserFavorites = async () => {
    try {
      const response = await axios.get('/api/user/favorites');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch favorites' 
      };
    }
  };

  // Get user playlists
  const getUserPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlist');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch playlists' 
      };
    }
  };

  // Get user stats (for admin dashboard)
  const getUserStats = async () => {
    try {
      const response = await axios.get('/api/user/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user stats' 
      };
    }
  };

  // Toggle favorite song
  const toggleFavorite = async (songId) => {
    try {
      const response = await axios.post(`/api/music/favorite/${songId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to toggle favorite status' 
      };
    }
  };

  // Admin: Get all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch users' 
      };
    }
  };

  // Admin: Get user logs
  const getUserLogs = async () => {
    try {
      const response = await axios.get('/api/admin/logs');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user logs' 
      };
    }
  };

  // Admin: Get dashboard stats
  const getDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch dashboard stats' 
      };
    }
  };

  return {
    getUserProfile,
    getUserFavorites,
    getUserPlaylists,
    getUserStats,
    toggleFavorite,
    getAllUsers,
    getUserLogs,
    getDashboardStats
  };
};

// Helper function to create the service
const userService = createUserService();

export default userService;
