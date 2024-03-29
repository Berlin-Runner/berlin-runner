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

    // Create a flex container for inline display of elements
    const flexContainer = document.createElement('div');
    flexContainer.style.display = 'flex';
    flexContainer.style.flexDirection = 'row';
    flexContainer.style.alignItems = 'center';
    flexContainer.style.marginTop = '10px';
    container.appendChild(flexContainer);

    // Radio Channel Selection Label
    const stationSelectLabel = document.createElement('span');
    stationSelectLabel.textContent = 'Radio Channel Selection: ';
    flexContainer.appendChild(stationSelectLabel);

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
    flexContainer.appendChild(stationSelect); // Append to the flex container for inline display

    // Mute/Unmute Button
    const muteUnmuteBtn = document.createElement('span');
    muteUnmuteBtn.className = 'material-symbols-outlined mute-icon';
    muteUnmuteBtn.id = 'mute';
    muteUnmuteBtn.textContent = this.audioManager.isMute
      ? 'volume_off'
      : 'volume_up';
    muteUnmuteBtn.style.cursor = 'pointer';
    muteUnmuteBtn.style.marginLeft = '15px'; // Adjust spacing between the dropdown and mute button
    muteUnmuteBtn.style.color = this.audioManager.isMute
      ? 'red'
      : 'greenyellow';
    muteUnmuteBtn.addEventListener('click', () => {
      this.audioManager.toggleMute();
    });
    flexContainer.appendChild(muteUnmuteBtn);

    // Audio Status Text
    const audioStatusText = document.createElement('div');
    audioStatusText.id = 'audio_status_text';
    audioStatusText.className = 'mute-icon-text';
    audioStatusText.textContent = this.audioManager.isMute
      ? 'MUTED'
      : 'UNMUTED';
    audioStatusText.style.color = this.audioManager.isMute
      ? 'red'
      : 'greenyellow';
    audioStatusText.style.marginLeft = '10px'; // Adjust spacing for visual separation
    flexContainer.appendChild(audioStatusText);

    // Update UI on global mute state change
    document.addEventListener('audioMuteToggle', (event) => {
      const isMute = event.detail.isMute;
      muteUnmuteBtn.textContent = isMute ? 'volume_off' : 'volume_up';
      muteUnmuteBtn.style.color = isMute ? 'red' : 'greenyellow';
      audioStatusText.textContent = isMute ? 'MUTED' : 'UNMUTED';
      audioStatusText.style.color = isMute ? 'red' : 'greenyellow';
    });
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
