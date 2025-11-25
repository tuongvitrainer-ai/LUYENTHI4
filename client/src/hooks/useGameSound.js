import { useCallback, useEffect, useState } from 'react';
import soundManager from '../utils/soundManager';

/**
 * useGameSound Hook
 *
 * Custom hook để sử dụng âm thanh trong games
 * Tự động khởi tạo AudioContext và cung cấp các hàm play sound tiện lợi
 *
 * @returns {Object} Sound controls và state
 *
 * @example
 * const { playClick, playCorrect, playWrong, isMuted, toggleMute } = useGameSound();
 *
 * // Sử dụng trong component
 * <button onClick={() => { playClick(); handleSubmit(); }}>
 *   Submit
 * </button>
 */
export const useGameSound = () => {
  const [soundState, setSoundState] = useState({
    volume: soundManager.masterVolume,
    isMuted: soundManager.isMuted,
    isInitialized: false,
  });

  // Khởi tạo AudioContext khi component mount
  useEffect(() => {
    // AudioContext chỉ được tạo sau user interaction
    const initSound = () => {
      soundManager.init();
      setSoundState(soundManager.getState());
    };

    // Lắng nghe user interaction đầu tiên
    document.addEventListener('click', initSound, { once: true });
    document.addEventListener('keydown', initSound, { once: true });

    return () => {
      document.removeEventListener('click', initSound);
      document.removeEventListener('keydown', initSound);
    };
  }, []);

  // Play Click Sound
  const playClick = useCallback((volume) => {
    soundManager.playClick(volume);
  }, []);

  // Play Correct Answer Sound
  const playCorrect = useCallback((volume) => {
    soundManager.playCorrect(volume);
  }, []);

  // Play Wrong Answer Sound
  const playWrong = useCallback((volume) => {
    soundManager.playWrong(volume);
  }, []);

  // Play Success Sound (hoàn thành game)
  const playSuccess = useCallback((volume) => {
    soundManager.playSuccess(volume);
  }, []);

  // Play Fail Sound (thua game)
  const playFail = useCallback((volume) => {
    soundManager.playFail(volume);
  }, []);

  // Play Hover Sound
  const playHover = useCallback((volume) => {
    soundManager.playHover(volume);
  }, []);

  // Play Coin Sound (nhặt sao/xu)
  const playCoin = useCallback((volume) => {
    soundManager.playCoin(volume);
  }, []);

  // Set Volume (0 - 1)
  const setVolume = useCallback((volume) => {
    soundManager.setVolume(volume);
    setSoundState(soundManager.getState());
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const newMutedState = soundManager.toggleMute();
    setSoundState(soundManager.getState());
    return newMutedState;
  }, []);

  // Set Muted
  const setMuted = useCallback((muted) => {
    soundManager.setMuted(muted);
    setSoundState(soundManager.getState());
  }, []);

  return {
    // Sound functions
    playClick,
    playCorrect,
    playWrong,
    playSuccess,
    playFail,
    playHover,
    playCoin,

    // Controls
    setVolume,
    toggleMute,
    setMuted,

    // State
    volume: soundState.volume,
    isMuted: soundState.isMuted,
    isInitialized: soundState.isInitialized,
  };
};

export default useGameSound;
