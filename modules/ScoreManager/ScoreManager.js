class ScoreManager {
  constructor(context) {
    this.context = context;
    this.stateManager = this.context.gameStateManager;
    this.stateBus = this.context.gameStateEventBus;
    this.score = 0;

    this.init();
  }

  init() {
    this.setupEventBusSubscriptions();
  }

  setupEventBusSubscriptions() {
    this.stateBus.subscribe("restart_game", () => {
      this.score = 0;
    });

    this.stateBus.subscribe("back_to_home", () => {
      this.score = 0;
    });
  }

  formatScore(score) {
    return Number(score.toFixed(2));
  }

  getScore() {
    return this.formatScore(this.score);
  }

  update() {
    if (this.stateManager.currentState === "in_play") {
      if (this.score >= this.context.currentLevel.levelInfo.levelScoreObjcetive)
        this.stateManager.gameOver();
      this.score++;
      this.context.scoreEventBus.publish(
        "update_score",
        this.formatScore(this.score)
      );
    }
  }
}

export { ScoreManager };
