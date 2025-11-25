import axiosInstance from '../config/axios';

/**
 * API lấy danh sách tất cả games/exams
 * @returns {Promise} Response từ server
 */
export const getAllGamesAPI = async () => {
  try {
    const response = await axiosInstance.get('/api/games');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy danh sách games' };
  }
};

/**
 * API lấy chi tiết một game/exam (bao gồm câu hỏi)
 * @param {number} gameId - ID của game
 * @returns {Promise} Response từ server
 */
export const getGameByIdAPI = async (gameId) => {
  try {
    const response = await axiosInstance.get(`/api/games/${gameId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy chi tiết game' };
  }
};

/**
 * API nộp kết quả game (Bắt buộc đăng nhập)
 * @param {number} gameId - ID của game
 * @param {Object} data - { answers: [{ questionId, userAnswer, isCorrect }], score }
 * @returns {Promise} Response từ server
 */
export const submitGameResultAPI = async (gameId, data) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/submit`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể nộp kết quả' };
  }
};
