/**
 * Sound Manager - Game Audio System
 * Sử dụng Web Audio API để tạo âm thanh cho games
 */

class SoundManager {
  constructor() {
    // Khởi tạo AudioContext (chỉ khi cần, do browser policy)
    this.audioContext = null;
    this.masterVolume = 0.3; // Volume mặc định: 30%
    this.isMuted = false;
    this.sounds = new Map(); // Cache các âm thanh đã tạo
  }

  /**
   * Khởi tạo AudioContext (gọi sau user interaction)
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Tạo âm thanh "Click" - Tiếng click nút
   * Frequency: 800Hz, Duration: 50ms
   */
  playClick(volume = 1) {
    if (this.isMuted) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Cấu hình âm thanh
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);

    // Volume envelope (fade out nhanh)
    const finalVolume = this.masterVolume * volume * 0.2;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    // Play
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  /**
   * Tạo âm thanh "Correct" - Tiếng trả lời đúng (Ting!)
   * Ascending tone: 523Hz -> 1047Hz (C5 -> C6)
   */
  playCorrect(volume = 1) {
    if (this.isMuted) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Cấu hình - âm thanh vui vẻ, tăng dần
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.15); // C6

    // Volume envelope
    const finalVolume = this.masterVolume * volume * 0.3;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    // Play
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);

    // Thêm harmonics để âm thanh hay hơn
    this._playHarmonic(698, 0.1, 0.15, finalVolume * 0.5); // F5
  }

  /**
   * Tạo âm thanh "Wrong" - Tiếng trả lời sai (Buzz!)
   * Descending tone: 400Hz -> 200Hz
   */
  playWrong(volume = 1) {
    if (this.isMuted) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Cấu hình - âm thanh buồn, giảm dần
    oscillator.type = 'sawtooth'; // Harsh sound
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    // Volume envelope
    const finalVolume = this.masterVolume * volume * 0.25;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    // Play
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  /**
   * Tạo âm thanh "Success" - Hoàn thành màn chơi
   * Melody: C-E-G-C (chord arpeggio)
   */
  playSuccess(volume = 1) {
    if (this.isMuted) return;

    const notes = [
      { freq: 523, delay: 0 },     // C5
      { freq: 659, delay: 0.1 },   // E5
      { freq: 784, delay: 0.2 },   // G5
      { freq: 1047, delay: 0.3 },  // C6
    ];

    notes.forEach(note => {
      this._playNote(note.freq, 0.2, note.delay, volume * 0.25);
    });
  }

  /**
   * Tạo âm thanh "Fail" - Thua màn chơi
   * Sad descending notes
   */
  playFail(volume = 1) {
    if (this.isMuted) return;

    const notes = [
      { freq: 392, delay: 0 },     // G4
      { freq: 349, delay: 0.15 },  // F4
      { freq: 294, delay: 0.3 },   // D4
      { freq: 262, delay: 0.45 },  // C4
    ];

    notes.forEach(note => {
      this._playNote(note.freq, 0.15, note.delay, volume * 0.2, 'triangle');
    });
  }

  /**
   * Tạo âm thanh "Hover" - Di chuột qua nút
   */
  playHover(volume = 1) {
    if (this.isMuted) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);

    const finalVolume = this.masterVolume * volume * 0.1;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }

  /**
   * Tạo âm thanh "Coin" - Nhặt được sao/xu
   */
  playCoin(volume = 1) {
    if (this.isMuted) return;

    const ctx = this.init();

    // Two quick notes
    this._playNote(1047, 0.08, 0, volume * 0.2);    // C6
    this._playNote(1319, 0.08, 0.08, volume * 0.2); // E6
  }

  /**
   * Helper: Tạo một note đơn
   */
  _playNote(frequency, duration, delay = 0, volume = 0.3, type = 'sine') {
    const ctx = this.audioContext;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    const finalVolume = this.masterVolume * volume;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  }

  /**
   * Helper: Tạo harmonic (âm hài)
   */
  _playHarmonic(frequency, delay, duration, volume) {
    this._playNote(frequency, duration, delay, volume);
  }

  /**
   * Cài đặt volume chung
   */
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Bật/tắt âm thanh
   */
  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Lấy trạng thái
   */
  getState() {
    return {
      volume: this.masterVolume,
      isMuted: this.isMuted,
      isInitialized: this.audioContext !== null,
    };
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
export default soundManager;
