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
      autoPlay: true, // Set to true for radio player to auto-play on unmute
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
    flexContainer.style.padding = '5px 0px 12px';
    container.appendChild(flexContainer);

    // Station Name Display
    const stationNameDisplay = document.createElement('span');
    stationNameDisplay.textContent =
      this.stations[this.currentStationIndex].name;
    stationNameDisplay.style.flexGrow = '1'; // Allows the station name to take up more space
    stationNameDisplay.style.marginRight = '10px'; // Space before the next button

    // Next Station Button
    const nextStationBtn = document.createElement('button');
    nextStationBtn.textContent = '▶|'; // Next station icon
    nextStationBtn.style.color = 'white';
    nextStationBtn.style.cursor = 'pointer';
    nextStationBtn.style.backgroundColor = 'transparent';
    nextStationBtn.style.border = '1px solid bisque'; // Light gray border
    nextStationBtn.style.borderRadius = '5px'; // Rounded corners

    nextStationBtn.addEventListener('click', () => {
      // Increment the station index, wrapping around if necessary
      this.currentStationIndex =
        (this.currentStationIndex + 1) % this.stations.length;
      // Update the station and the button text (including the icon)
      this.switchStation(this.currentStationIndex);
      stationNameDisplay.textContent =
        this.stations[this.currentStationIndex].name; // Update the station name text
    });

    // Store the button reference in the class instance
    this.nextStationBtn = nextStationBtn;

    // Mute/Unmute Button
    const muteUnmuteBtn = document.createElement('span');
    muteUnmuteBtn.className = 'material-symbols-outlined mute-icon';
    muteUnmuteBtn.id = 'mute';
    muteUnmuteBtn.innerHTML = this.audioManager.isMute
      ? '&#x1F508;'
      : '&#x1F50A;';
    muteUnmuteBtn.style.cursor = 'pointer';
    muteUnmuteBtn.style.marginRight = '5px'; // Adjust spacing between the dropdown and mute button
    muteUnmuteBtn.style.color = this.audioManager.isMute
      ? 'red'
      : 'greenyellow';
    muteUnmuteBtn.addEventListener('click', () => {
      this.audioManager.toggleMute();
    });
    flexContainer.appendChild(muteUnmuteBtn);
    flexContainer.appendChild(stationNameDisplay);
    flexContainer.appendChild(nextStationBtn); // Append to the flex container for inline display: ;

    // Update UI on global mute state change
    document.addEventListener('audioMuteToggle', (event) => {
      const isMute = event.detail.isMute;
      muteUnmuteBtn.innerHTML = this.audioManager.isMute
        ? '&#x1F508;'
        : '&#x1F50A;';
      muteUnmuteBtn.style.color = isMute ? 'red' : 'greenyellow';
      // audioStatusText.textContent = isMute ? 'MUTED' : 'UNMUTED';
      // audioStatusText.style.color = isMute ? 'red' : 'greenyellow';
    });
  }

  // Switches the current radio station and updates the audio source
  switchStation(index) {
    this.currentStationIndex = index;
    const stationUrl = this.stations[index].url;
    if (this.audioComponent.sound) {
      this.audioComponent.sound.src = stationUrl;
      this.audioComponent.sound.load();
      this.audioComponent.sound.muted = this.audioManager.isMute; // Respect initial mute state
      this.audioComponent.sound.play().catch((error) => {
        console.error('Error playing sound:', error);
        // Handle auto-play policy issues or other errors here
      });
    }
    // Update the cycle station button's text to the current station's name
    // Ensure nextStationBtn is defined before trying to update its textContent
    if (this.nextStationBtn) {
      this.nextStationBtn.textContent = '▶|';
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
