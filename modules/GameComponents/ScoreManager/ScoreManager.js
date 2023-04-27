class ScoreManager {
	constructor(context) {
		this.context = context;
		this.stateManager = this.context.gameStateManager;
		this.stateBus = this.context.gameStateEventBus;
		this.scoreBus = this.context.scoreEventBus;
		this.score = 0;

		this.init();
		requestAnimationFrame(this.update.bind(this));
		this.updateScore = true;
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
			if (!this.updateScore) return;
			setTimeout(() => {
				this.updateScore = true;
			}, 1000);
			this.context.scoreEventBus.publish("increase-speed");
			this.score += value;
			this.updateScore = false;
			this.scoreBus.publish("update_score", this.formatScore(this.score));
		});
	}

	formatScore(score) {
		return Number(score.toFixed(2));
	}

	getScore() {
		return this.formatScore(this.score);
	}

	update() {}
}

export { ScoreManager };
