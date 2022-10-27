class ScoreManager {
	constructor(context) {
		this.context = context;
		this.stateManager = this.context.gameStateManager;
		this.stateBus = this.context.gameStateEventBus;
		this.scoreBus = this.context.scoreEventBus;
		this.score = 0;

		this.init();
		requestAnimationFrame(this.update.bind(this));
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

		this.scoreBus.subscribe("add-score", (value) => {
			// console.log("adding score value of " + value + " man");
			this.score += value;
			this.scoreBus.publish("update_score", this.formatScore(this.score));
		});
	}

	formatScore(score) {
		return Number(score.toFixed(2));
	}

	getScore() {
		return this.formatScore(this.score);
	}

	update() {
		setTimeout(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / 2);

		if (this.stateManager.currentState === "in_play") {
			if (this.score >= this.context.currentLevel.levelInfo.levelScoreObjcetive)
				this.stateManager.gameOver();
			/*   this.score++;
      this.context.scoreEventBus.publish(
        "update_score",
        this.formatScore(this.score)
      ); */
		}
	}
}

export { ScoreManager };
