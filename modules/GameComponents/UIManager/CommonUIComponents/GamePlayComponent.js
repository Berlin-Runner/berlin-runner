import { BaseUIComponent } from '../BaseUIComponent.js';
import { ExplosiveElement } from '../ExplosiveButton.js';

class GamePlayComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);

    this.pauseButton = new BaseUIComponent('pause-button', this.context);
    this.pauseButton.uiComponent.innerHTML = '&#x23EF; Pause Game'; // Set the pause symbol as button content
    this.isGamePaused = false; // Add a flag to track game pause state

    this.scoreHolder = document.getElementById('score_text');
    this.progressHolder = document.getElementById('progress_text');
    this.progressBar = document.getElementById('progressBar');
    this.incrementValue(0);
    this.explosiveProgressBar = new ExplosiveElement('progress-holder');

    this.healthValueHolder = document.getElementById('health-value');

    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();
  }

  incrementValue(value) {
    if (value < 10) {
      progressBar.style.width = `${value * 10}%`; // Update width based on value
    }
  }

  setUpComponentEventListners() {
    this.pauseButton.listenToEvent('click', () => {
      // Toggle between pausing and resuming the game
      if (this.isGamePaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });
    this.stateBus.subscribe('restart_game', () => {
      this.pauseButton.showComponent();
      this.scoreHolder.innerText = '0';
      this.progressHolder.innerText = '0';
      this.incrementValue(0);
      this.healthValueHolder.innerText = '=)';
    });
  }

  pauseGame() {
    console.log('Pausing the game');
    this.stateManager.pauseGame();
    this.stateBus.publish('pause_game'); // Publish event to pause the game
    this.isGamePaused = true;
    this.updatePauseButtonText(); // Update the button text
    // Move bottom-controls to paused-screen
    document
      .getElementById('paused-screen')
      .appendChild(document.getElementById('bottom-controls'));
  }

  resumeGame() {
    console.log('Resuming the game');
    this.stateManager.resumeGame();
    this.stateBus.publish('resume_game'); // Publish event to resume the game
    this.isGamePaused = false;
    this.updatePauseButtonText(); // Update the button text
    // Move bottom-controls back to in-play-screen
    document
      .getElementById('in-play-screen')
      .appendChild(document.getElementById('bottom-controls'));
  }

  updatePauseButtonText() {
    // Update the button text based on the game state
    this.pauseButton.uiComponent.innerHTML = this.isGamePaused
      ? '&#x23EF; Resume Game'
      : '&#x23EF; Pause Game';
  }

  setupEventBusSubscriptions() {
    this.scoreBus.subscribe('update_score', (score) => {
      this.upadteScore(score);
    });

    this.scoreBus.subscribe('update_progress', (value) => {
      this.upadteProgress(value);
      this.incrementValue(value);
    });

    this.context.scoreEventBus.subscribe('level-one', () => {
      this.explosiveProgressBar.runExplosion();
    });

    this.context.scoreEventBus.subscribe('level-two', () => {
      this.explosiveProgressBar.runExplosion();
    });

    this.healthBus.subscribe('update_health', (health) => {
      this.updateHealth(health);
    });

    this.stateBus.subscribe('restart_game', () => {
      this.showComponent();
      this.scoreHolder.innerText = '0';
      this.progressHolder.innerText = '0';
      this.incrementValue(0);
      this.healthValueHolder.innerText = '=)';
      this.isGamePaused = false;
      this.updatePauseButtonText();

      // Ensure bottom-controls are moved back to in-play-screen
      document
        .getElementById('in-play-screen')
        .appendChild(document.getElementById('bottom-controls'));

      // Reset any specific styles if necessary, for example:
      document.getElementById('in-play-screen').style.display = 'flex'; // Or any other style adjustments needed
    });
  }

  upadteScore(score) {
    this.scoreHolder.innerText = score;
    gsap.to(this.scoreHolder.style, {
      fontSize: '136px',
      duration: 0.125,
      onComplete: () => {
        gsap.to(this.scoreHolder.style, { fontSize: '60px', duration: 0.1 });
      },
    });
  }

  upadteProgress(value) {
    this.progressHolder.innerText = value;
    gsap.to(this.progressHolder.style, {
      fontSize: '136px',
      duration: 0.125,
      onComplete: () => {
        gsap.to(this.progressHolder.style, { fontSize: '60px', duration: 0.1 });
      },
    });
  }

  updateHealth(health) {
    this.healthValueHolder.innerText = health;
  }
}

export { GamePlayComponent };
