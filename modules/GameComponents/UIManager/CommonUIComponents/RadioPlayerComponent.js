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
    // Add a Play/Pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'play-pause-btn';
    playPauseBtn.textContent = 'Play'; // Initial button text
    playPauseBtn.addEventListener('click', () => this.togglePlayPause());

    this.uiComponent.appendChild(playPauseBtn);

    // Add a station selection dropdown
    const stationSelect = document.createElement('select');
    stationSelect.id = 'station-select';
    this.stations.forEach((station, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = station.name;
      stationSelect.appendChild(option);
    });
    stationSelect.addEventListener('change', () => {
      this.switchStation(stationSelect.value);
    });
    this.uiComponent.appendChild(stationSelect);

    // Container for volume control and label
    const volumeContainer = document.createElement('div');
    volumeContainer.id = 'volume-container';

    // Label for the volume control slider
    const volumeLabel = document.createElement('label');
    volumeLabel.id = 'volume-control-label';
    volumeLabel.setAttribute('for', 'volume-control');
    volumeLabel.textContent = 'Volume';
    volumeContainer.appendChild(volumeLabel); // Add label to the container

    // Add a volume control slider
    const volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.id = 'volume-control';
    volumeControl.min = 0; // Minimum volume
    volumeControl.max = 1; // Maximum volume
    volumeControl.step = 0.01; // Fineness of control
    volumeControl.value = this.audioElement.volume; // Default to the current volume

    volumeControl.addEventListener('input', () => {
      this.adjustVolume(volumeControl.value);
    });

    volumeContainer.appendChild(volumeControl); // Add slider to the container

    this.uiComponent.appendChild(volumeContainer); // Add the volume container to the UI component
  }

  // Toggles play/pause state of the audio
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

  // Switches the current radio station and updates the audio source
  switchStation(index) {
    this.currentStationIndex = index;
    this.audioElement.src = this.stations[index].url;
    // Remove any existing event listeners to avoid multiple triggers
    this.audioElement.removeEventListener('canplay', this.playAudio);
    // Define playAudio as an arrow function to preserve the context of 'this'
    this.playAudio = () => {
      this.audioElement
        .play()
        .then(() => {
          document.getElementById('play-pause-btn').textContent = 'Pause';
        })
        .catch((error) => {
          console.error('Playback failed:', error);
          // Handle playback failure here
        });
    };
    // Add event listener for 'canplay' event
    this.audioElement.addEventListener('canplay', this.playAudio);
  }

  // Adjusts the volume of the audio element
  adjustVolume(volumeLevel) {
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
