class BaseAudioComponent {
  constructor(audioManager, opts) {
    this.audioManager = audioManager;

    // Default values provided to avoid undefined errors
    const defaults = {
      url: '',
      doesLoop: false,
      volume: 1.0,
    };
    // Object destructuring with default values
    const { url, doesLoop, volume } = { ...defaults, ...opts };

    this.audioUrl = url;
    this.loop = doesLoop;
    this.volume = volume;

    this.init();
  }

  init() {
    this.sound = new Audio(this.audioUrl);
    this.sound.loop = this.loop;
    this.sound.volume = this.volume;

    // Reflect the AudioManager's current mute state
    this.sound.muted = this.audioManager.isMute;
    this.sound.addEventListener('loadeddata', () => {
      // Consider preloading or other setup tasks here.
      // For instance, you might want to ensure the audio is ready to play without delay.
    });

    // Register this component with the AudioManager for centralized control
    this.audioManager.addAudioSource(this);
  }

  play() {
    if (this.sound) {
      this.sound.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  }

  stop() {
    if (this.sound) {
      this.sound.pause();
      this.sound.currentTime = 0; // Rewind the audio
    }
  }

  cleanup() {
    this.stop();
    // Deregister from AudioManager to ensure proper cleanup
    this.audioManager.removeAudioSource(this);
    this.sound.removeEventListener('loadeddata', this.handleLoadedData);
    this.sound = null;
  }

  updateVolume(volume) {
    if (this.sound) {
      this.sound.volume = volume;
    }
  }

  updateMuteState(isMute) {
    if (this.sound) {
      this.sound.muted = isMute;
    }
  }
}

export { BaseAudioComponent };
