import axiosInstance from '../config/axios';

// ============== USER MANAGEMENT API ==============

/**
 * Lấy danh sách tất cả users (có phân trang)
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} limit - Số lượng users mỗi trang (default: 10)
 * @returns {Promise} Response từ server
 */
export const getAllUsersAPI = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/api/admin/users', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy danh sách users' };
  }
};

/**
 * Cập nhật thông tin user
 * @param {number} userId - ID của user cần cập nhật
 * @param {Object} data - { role, full_name, avatar_url }
 * @returns {Promise} Response từ server
 */
export const updateUserAPI = async (userId, data) => {
  try {
    const response = await axiosInstance.put(`/api/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi cập nhật user' };
  }
};

/**
 * Xóa user
 * @param {number} userId - ID của user cần xóa
 * @returns {Promise} Response từ server
 */
export const deleteUserAPI = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa user' };
  }
};

// ============== LESSON MANAGEMENT API ==============

/**
 * Lấy danh sách tất cả lessons (có phân trang)
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} limit - Số lượng lessons mỗi trang (default: 10)
 * @returns {Promise} Response từ server
 */
export const getAllLessonsAPI = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/api/admin/lessons', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy danh sách lessons' };
  }
};

/**
 * Lấy chi tiết một lesson
 * @param {number} lessonId - ID của lesson
 * @returns {Promise} Response từ server
 */
export const getLessonByIdAPI = async (lessonId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy chi tiết lesson' };
  }
};

/**
 * Tạo bài học mới
 * @param {Object} data - { chapter_id, title, description, thumbnail_url, is_free, order }
 * @returns {Promise} Response từ server
 */
export const createLessonAPI = async (data) => {
  try {
    const response = await axiosInstance.post('/api/admin/lessons', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi tạo lesson' };
  }
};

/**
 * Cập nhật bài học
 * @param {number} lessonId - ID của lesson cần cập nhật
 * @param {Object} data - { chapter_id, title, description, thumbnail_url, is_free, order }
 * @returns {Promise} Response từ server
 */
export const updateLessonAPI = async (lessonId, data) => {
  try {
    const response = await axiosInstance.put(`/api/admin/lessons/${lessonId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi cập nhật lesson' };
  }
};

/**
 * Xóa bài học
 * @param {number} lessonId - ID của lesson cần xóa
 * @returns {Promise} Response từ server
 */
export const deleteLessonAPI = async (lessonId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa lesson' };
  }
};
