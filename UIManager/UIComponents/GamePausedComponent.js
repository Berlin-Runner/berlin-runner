class GamePausedComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);

    this.resumeButton = document.getElementById("resume-button");
    this.restartButton = document.getElementById("restart-button");

    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();
  }

  setUpComponentEventListners() {
    this.resumeButton.addEventListener("click", () => {
      this.resumeGame();
    });

    this.restartButton.addEventListener("click", () => {
      this.restartGame();
    });
  }

  setupEventBusSubscriptions() {
    /* this.scoreBus.subscribe("update_score", (score) => {
      this.upadteScore(score);
    });

    this.healthBus.subscribe("update_health", (health) => {
      this.updateHealth(health);
    });
    */

    this.stateBus.subscribe("pause_game", () => {
      this.showComponent();
      this.showStatic();
    });

    this.stateBus.subscribe("resume_game", () => {
      this.hideComponent();
      this.hideStatic();
    });

    this.stateBus.subscribe("restart_game", () => {
      this.hideComponent();
      this.hideStatic();
    });
  }

  resumeGame() {
    console.log("resuming game");
    this.stateManager.resumeGame();
  }

  restartGame() {
    console.log("restarting gmae");
    this.stateManager.restartGame();
  }
}
