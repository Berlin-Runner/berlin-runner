import { BaseUIComponent } from "../BaseUIComponent.js";
class GameOverComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);

    this.restartLevelButton = document.getElementById("restart-level-button");
    this.backToHomeButton = document.getElementById("back-to-home-button");

    this.finalScoreHolder = document.getElementById("game-over-final-score");

    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();
  }

  setUpComponentEventListners() {
    this.restartLevelButton.addEventListener("click", () => {
      console.log("restarting level");
      this.restart();
    });

    this.backToHomeButton.addEventListener("click", () => {
      console.log("going back to home");
      this.backToHome();
    });
  }

  setupEventBusSubscriptions() {
    this.stateBus.subscribe("game_over", () => {
      this.finalScoreHolder.innerHTML = this.scoreManager.getScore();
      this.showComponent();
      this.showStatic();
    });

    this.stateBus.subscribe("restart_game", () => {
      this.hideComponent();
      this.hideStatic();
    });

    this.stateBus.subscribe("back_to_home", () => {
      this.hideComponent();
    });
  }

  restart() {
    this.stateManager.restartGame();
    console.log("restart function");
  }

  backToHome() {
    console.log("back to home button");
    this.stateManager.resetState();
  }
}

export { GameOverComponent };
