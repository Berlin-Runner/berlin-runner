class AudioManager {
  constructor() {
    // Ensures a single instance of AudioManager throughout the application.
    if (!AudioManager.instance) {
      this.audioSources = []; // Holds all registered audio sources for global mute/unmute.
      this.initFields();
      AudioManager.instance = this;
    }
    if (!this.listenersSetUp) {
      this.initializeListeners(); // Ensure listeners are set up as soon as the instance is created.
    }
    return AudioManager.instance;
  }

  // Initializes class fields to set default states and collections.
  initFields() {
    this.isMute = true; // Initialize as true to match the initial "muted" state in HTML
    this.listenersSetUp = false;
    this.isContextActivated = false; // track AudioContext activation
    this.audioContext = null; // Moved here for clarity
  }

  async initializeListeners() {
    if (!this.listenersSetUp) {
      this.attachMuteToggleListener();
      this.attachKeyboardListeners();
      this.listenersSetUp = true;
    }
  }

  // Separate logic for attaching the mute toggle listener.
  attachMuteToggleListener() {
    try {
      const muteToggle = document.getElementById('mute');
      if (!muteToggle) throw new Error('Mute toggle element not found.');
      muteToggle.addEventListener('click', () => {
        this.toggleMute().catch((error) =>
          console.error('Error toggling mute:', error)
        );
      });
      console.info('Mute toggle CLICK listener attached.');
    } catch (error) {
      console.error('Error setting up mute toggle listener:', error);
    }
  }

  // Separate logic for attaching keyboard listeners, specifically for muting/unmuting.
  attachKeyboardListeners() {
    try {
      document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyM') {
          this.toggleMute().catch((error) =>
            console.error('Error toggling mute:', error)
          );
        }
      });
      console.info('Global KEYDOWN listener for mute toggle attached.');
    } catch (error) {
      console.error('Error setting up keyboard listeners:', error);
    }
  }

  // Asynchronously initializes and resumes the AudioContext, managing browser autoplay policies.
  async initializeAudioContext() {
    if (!this.isContextActivated && typeof AudioContext !== 'undefined') {
      this.audioContext = new AudioContext();
      try {
        await this.audioContext.resume();
        this.isContextActivated = true;
        console.log('AudioContext activated.');
      } catch (error) {
        console.error('Error initializing AudioContext:', error);
      }
    }
  }

  // Toggles the global mute state and updates audio sources and UI elements accordingly.
  async toggleMute() {
    try {
      // Ensure the AudioContext is initialized before toggling mute state.
      if (!this.isContextActivated && typeof AudioContext !== 'undefined') {
        await this.initializeAudioContext();
      }
      this.isMute = !this.isMute;

      // Attempt to play audio sources if unmuting
      if (!this.isMute) {
        this.audioSources.forEach((source) => {
          if (source.sound && source.sound.paused && source.autoPlay) {
            source.sound
              .play()
              .catch((error) => console.error('Playback error:', error));
          }
        });
      }

      this.applyMuteStateToAllSources();
      // Emit an event instead of directly updating UI
      // Dispatch the event to notify all components of the mute state change.
      const audioMuteEvent = new CustomEvent('audioMuteToggle', {
        detail: { isMute: this.isMute },
      });
      document.dispatchEvent(audioMuteEvent);
      console.log(this.isMute ? 'Audio muted' : 'Audio unmuted');
    } catch (error) {
      console.error('Error toggling mute state:', error);
      // Optionally handle the error by reverting state or notifying the user.
    }
  }

  // Apply the current mute state to all registered audio sources
  applyMuteStateToAllSources() {
    this.audioSources.forEach((source) => {
      try {
        if (source && source.sound.muted !== undefined) {
          source.updateMuteState(this.isMute);
        }
      } catch (error) {
        console.error('Error applying mute state to an audio source:', error);
        // Handle individual source errors, possibly removing them from the list.
      }
    });
  }

  // Add an audio source to the manager, applying the current mute state.
  addAudioSource(source) {
    try {
      if (source) {
        this.audioSources.push(source);
        source.updateMuteState(this.isMute); // Apply current mute state to new audio source.
      }
    } catch (error) {
      console.error('Error adding audio source:', error);
      // Consider removing the faulty source or notifying the user.
    }
  }

  // Removes an audio source from the manager
  removeAudioSource(audio) {
    try {
      const index = this.audioSources.indexOf(audio);
      if (index !== -1) {
        this.audioSources.splice(index, 1);
      }
    } catch (error) {
      console.error('Error removing audio source:', error);
      // Additional error handling logic here
    }
  }

  // Sets the volume for all audio sources, ensuring the volume is within an acceptable range.
  setVolume(volume) {
    try {
      // Ensure volume is between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.audioSources.forEach((source) => {
        if (source && 'volume' in source) {
          // Added check for 'volume' property existence.
          source.volume = clampedVolume;
        }
      });
    } catch (error) {
      console.error('Error setting volume:', error);
      // Consider handling this error by notifying the user or reverting to a default volume.
    }
  }

  // Retrieves the singleton instance of AudioManager, creating it if necessary.
  static getInstance() {
    return AudioManager.instance || new AudioManager();
  }
}

export { AudioManager };
