import { BaseUIComponent } from '../BaseUIComponent.js';
import { DistrictUI } from './DistrictUI.js';
class DistrictPickerComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);

    this.scoreHolder = document.getElementById('score-holder');
    this.scoreHolder.style.display = 'none';

    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();

    this.setupDistricts();
  }

  setupDistricts() {
    // Initialize district UI components here
    // Example: this.districtOne = new DistrictUI("district-one", this.context, 0);
  }

  setUpComponentEventListners() {
    // Set up any event listeners specific to this component
  }

  setupEventBusSubscriptions() {
    this.stateBus.subscribe('start_game', () => {
      this.hideComponent();
      // Optionally hide static or perform other actions
      // this.hideStatic();
    });

    this.stateBus.subscribe('pick-district', () => {
      this.showComponent();
      this.showStatic();
    });
  }

  startGame() {
    // console.log("start game function");
    // this.stateManager.startGame();
  }

  // AudioManager globally manages audio. See handleAudioMuteToggle(event) for component-specific controls.
  muteToggle() {
    // Placeholder for potential future audio management refinements.
  }
}

export { DistrictPickerComponent };
