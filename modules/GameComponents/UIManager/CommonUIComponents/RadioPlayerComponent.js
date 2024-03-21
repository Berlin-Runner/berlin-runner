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
    const playPauseButton =
      this.uiComponent.querySelector('.play-pause-button');
    playPauseButton.addEventListener('click', () => this.togglePlayPause());

    // Implement channel selection UI setup
    // ...
  }

  togglePlayPause() {
    // Toggles play/pause state of the audio
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
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
