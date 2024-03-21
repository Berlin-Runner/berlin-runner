import { BaseUIComponent } from '../BaseUIComponent.js';

class RadioPlayerComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);
    // Define additional properties specific to the radio player
    this.audioElement = new Audio();
    this.currentStationIndex = 0; // Default to the first station
    this.stations = [
      {
        name: '70s Channel',
        url: 'https://streams.fluxfm.de/70er/mp3-320/audio/',
      },
      {
        name: 'Klubradio',
        url: 'https://streams.fluxfm.de/klubradio/mp3-320/audio/',
      },
      {
        name: 'BoomFM',
        url: 'https://streams.fluxfm.de/boomfm/mp3-320/audio/',
      },
    ];
    // Initially set the audio source to the first station
    this.audioElement.src = this.stations[this.currentStationIndex].url;
    this.setupUI();
  }

  setupUI() {
    // Implement UI setup logic here, including play/pause buttons and channel selection
    // This might involve creating DOM elements dynamically or showing/hiding existing ones based on `id`
    // Example for play/pause button setup
    // const playPauseButton =
    //   this.uiComponent.querySelector('.play-pause-button');
    // playPauseButton.addEventListener('click', () => this.togglePlayPause());
    // Implement channel selection UI setup
    // ...

    // Example for adding a Play/Pause button dynamically
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'play-pause-btn';
    playPauseBtn.textContent = 'Play'; // Initial button text
    playPauseBtn.addEventListener('click', () => this.togglePlayPause());

    this.uiComponent.appendChild(playPauseBtn);
  }

  togglePlayPause() {
    if (this.audioElement.paused) {
      this.audioElement
        .play()
        .then(() => {
          document.getElementById('play-pause-btn').textContent = 'Pause';
        })
        .catch((error) => {
          console.error('Playback failed:', error); // Log the error to the console
          // Show an error message to the user
          const errorMessageElement = document.getElementById('error-message');
          if (!errorMessageElement) {
            // If an error message element doesn't exist, create it and append it to the body or a specific container
            const newErrorMessageElement = document.createElement('div');
            newErrorMessageElement.id = 'error-message';
            newErrorMessageElement.style.color = 'red'; // Style the error message
            newErrorMessageElement.textContent =
              'Playback failed. Please try again later.';
            document.body.appendChild(newErrorMessageElement); // You might want to append this to a specific container instead
          } else {
            // If it exists, just update its message
            errorMessageElement.textContent =
              'Playback failed. Please try again later.';
          }
        });
    } else {
      this.audioElement.pause();
      document.getElementById('play-pause-btn').textContent = 'Play';
    }
  }

  switchStation(index) {
    // Switches the current radio station and updates the audio source
    this.currentStationIndex = index;
    this.audioElement.src = this.stations[index].url;
    this.audioElement.play();
  }

  adjustVolume(volumeLevel) {
    // Adjusts the volume of the audio element
    this.audioElement.volume = volumeLevel;
  }

  // Override handleAudioMuteToggle to mute/unmute radio player
  handleAudioMuteToggle(event) {
    const isMute = event.detail.isMute;
    this.audioElement.muted = isMute;
  }

  // Additional methods for managing radio player state and UI updates can be added here
}

export { RadioPlayerComponent };
