import axios from '../hooks/useAxios';

const handleApiError = (error) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export const getContent = async () => {
  try {
    const response = await axios.get('/content');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};