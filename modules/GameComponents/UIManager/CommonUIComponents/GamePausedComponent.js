import { BaseUIComponent } from '../BaseUIComponent.js';
class GamePausedComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);

    this.restartButton = document.getElementById('restart-button');

    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();
  }

  setUpComponentEventListners() {
    this.restartButton.addEventListener('click', () => {
      this.restartGame();
    });
  }

  setupEventBusSubscriptions() {
    this.stateBus.subscribe('pause_game', () => {
      this.showComponent(); // Show the paused screen
      this.showStatic();
    });

    this.stateBus.subscribe('resume_game', () => {
      this.hideComponent(); // Hide the paused screen
    });

    this.stateBus.subscribe('restart_game', () => {
      this.hideComponent();
      // this.hideStatic();
    });
  }

  resumeGame() {
    console.log('Resuming the game');
    this.stateManager.resumeGame();
    this.stateBus.publish('resume_game');
  }

  restartGame() {
    console.log('Restarting the game');
    this.stateManager.restartGame();
    this.stateBus.publish('restart_game');
  }
}

export { GamePausedComponent };
