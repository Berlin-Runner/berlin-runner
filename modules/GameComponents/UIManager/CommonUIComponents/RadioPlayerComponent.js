import { AudioManager } from '../../../Core/AudioManager/AudioManager.js';
import { BaseAudioComponent } from '../../../Core/AudioManager/BaseAudioComponent.js';
import { BaseUIComponent } from '../BaseUIComponent.js';

class RadioPlayerComponent {
  constructor(id, context) {
    this.audioManager = AudioManager.getInstance();
    this.audioComponent = new BaseAudioComponent(this.audioManager, {
      url: '', // The URL will be set in switchStation
      doesLoop: true,
      volume: 1.0,
    });
    // UI Component setup
    this.uiComponent = new BaseUIComponent(id, context).uiComponent;

    // Stations setup
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
    // Set the audio source to the first station and start playing immediately
    this.switchStation(this.currentStationIndex);
    // Listen for global mute state changes
    document.addEventListener(
      'audioMuteToggle',
      this.handleAudioMuteToggle.bind(this)
    );

    this.setupUI();
  }

  setupUI() {
    const container = this.uiComponent;

    // Station Selection Dropdown
    const stationSelect = document.createElement('select');
    stationSelect.id = 'station-select';
    this.stations.forEach((station, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = station.name;
      stationSelect.appendChild(option);
    });
    stationSelect.addEventListener('change', (e) => {
      this.switchStation(e.target.value);
    });
    container.appendChild(stationSelect);

    // Container for volume control and label
    const volumeContainer = document.createElement('div');
    volumeContainer.id = 'volume-container';

    // Label for the volume control slider
    const volumeLabel = document.createElement('label');
    volumeLabel.id = 'volume-control-label';
    volumeLabel.setAttribute('for', 'volume-control');
    volumeLabel.textContent = 'Volume:';
    volumeContainer.appendChild(volumeLabel); // Add label to the container

    // Add a volume control slider
    const volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.id = 'volume-control';
    volumeControl.min = 0; // Minimum volume
    volumeControl.max = 1; // Maximum volume
    volumeControl.step = 0.01; // Fineness of control
    volumeControl.value = this.audioComponent.sound.volume; // Default to the current volume
    volumeControl.addEventListener('input', (e) => {
      // Directly call `updateVolume` on `audioComponent` with the new value
      this.audioComponent.updateVolume(parseFloat(e.target.value));
    });
    volumeContainer.appendChild(volumeControl); // Add slider to the container
    container.appendChild(volumeContainer); // Add the volume container to the UI component
  }

  // Switches the current radio station and updates the audio source
  switchStation(index) {
    this.currentStationIndex = index;
    const stationUrl = this.stations[index].url;
    if (this.audioComponent.sound) {
      this.audioComponent.sound.src = stationUrl;
      this.audioComponent.sound.load();
      this.audioComponent.sound.play().catch((error) => {
        console.error('Error playing sound:', error);
        // Handle auto-play policy issues or other errors here
      });
    }
  }

  // Override handleAudioMuteToggle to mute/unmute radio player
  handleAudioMuteToggle = (event) => {
    const isMute = event.detail.isMute;
    if (this.audioComponent.sound) {
      this.audioComponent.sound.muted = isMute;
    }
  };

  // Additional methods for managing radio player state and UI updates can be added here
}

export { RadioPlayerComponent };
