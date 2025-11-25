/**
 * Service quản lý các pending rewards (phần thưởng chờ đăng nhập)
 * Lưu trữ trong localStorage
 */

const PENDING_REWARDS_KEY = 'pending_game_rewards';

/**
 * Lưu một pending reward vào localStorage
 * @param {Object} reward - { gameId, score, stars, answers, timestamp }
 */
export const savePendingReward = (reward) => {
  try {
    const pendingRewards = getPendingRewards();

    // Thêm timestamp
    const newReward = {
      ...reward,
      timestamp: new Date().toISOString(),
    };

    pendingRewards.push(newReward);

    localStorage.setItem(PENDING_REWARDS_KEY, JSON.stringify(pendingRewards));

    return true;
  } catch (error) {
    console.error('Error saving pending reward:', error);
    return false;
  }
};

/**
 * Lấy tất cả pending rewards từ localStorage
 * @returns {Array} Danh sách pending rewards
 */
export const getPendingRewards = () => {
  try {
    const data = localStorage.getItem(PENDING_REWARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pending rewards:', error);
    return [];
  }
};

/**
 * Lấy pending reward mới nhất
 * @returns {Object|null} Reward object hoặc null
 */
export const getLatestPendingReward = () => {
  const rewards = getPendingRewards();
  return rewards.length > 0 ? rewards[rewards.length - 1] : null;
};

/**
 * Xóa tất cả pending rewards
 */
export const clearPendingRewards = () => {
  try {
    localStorage.removeItem(PENDING_REWARDS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing pending rewards:', error);
    return false;
  }
};

/**
 * Đếm số lượng pending rewards
 * @returns {number} Số lượng pending rewards
 */
export const countPendingRewards = () => {
  const rewards = getPendingRewards();
  return rewards.length;
};

/**
 * Tính tổng số sao đang chờ
 * @returns {number} Tổng số sao
 */
export const getTotalPendingStars = () => {
  const rewards = getPendingRewards();
  return rewards.reduce((total, reward) => total + (reward.stars || 0), 0);
};
