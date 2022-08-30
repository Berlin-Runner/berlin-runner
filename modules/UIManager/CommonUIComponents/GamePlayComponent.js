import { BaseUIComponent } from "../BaseUIComponent.js";
class GamePlayComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);

    // this.pauseButton = document.getElementById("pause-button");
    this.pauseButton = new BaseUIComponent("pause-button", this.context);
    this.scoreHolder = document.getElementById("score_text");
    this.healthValueHolder = document.getElementById("haelth-value");

    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();
  }

  setUpComponentEventListners() {
    this.pauseButton.listenToEvent("click", () => {
      this.pauseGame();
    });
  }

  setupEventBusSubscriptions() {
    this.scoreBus.subscribe("update_score", (score) => {
      this.upadteScore(score);
    });

    this.healthBus.subscribe("update_health", (health) => {
      this.updateHealth(health);
    });

    this.stateBus.subscribe("pause_game", () => {
      this.pauseButton.hideComponent();
    });

    this.stateBus.subscribe("resume_game", () => {
      this.pauseButton.showComponent();
    });

    this.stateBus.subscribe("restart_game", () => {
      this.pauseButton.showComponent();
      this.scoreHolder.innerText = "=(";
      this.healthValueHolder.innerText = "=)";
    });
  }

  pauseGame() {
    console.log("pausing the game");
    this.stateManager.pauseGame();
  }

  upadteScore(score) {
    this.scoreHolder.innerText = score;
  }

  updateHealth(health) {
    this.healthValueHolder.innerText = health;
  }
}

export { GamePlayComponent };
