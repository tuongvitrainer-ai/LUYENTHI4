import axiosInstance from '../config/axios';

/**
 * API đăng ký user mới
 * @param {Object} data - { username, email, password, fullName, role }
 * @returns {Promise} Response từ server
 */
export const registerAPI = async (data) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng ký thất bại' };
  }
};

/**
 * API đăng nhập
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Response từ server (bao gồm token và user)
 */
export const loginAPI = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng nhập thất bại' };
  }
};

/**
 * API lấy thông tin user hiện tại (từ token)
 * @returns {Promise} Response từ server (bao gồm thông tin user)
 */
export const getMeAPI = async () => {
  try {
    const response = await axiosInstance.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy thông tin user' };
  }
};
