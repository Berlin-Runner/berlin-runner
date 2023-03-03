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
			this.restart();
		});

		this.backToHomeButton.addEventListener("click", () => {
			// this.backToHome();
		});
	}

	setupEventBusSubscriptions() {
		this.stateBus.subscribe("player-crashed", () => {
			this.finalScoreHolder.innerHTML = this.scoreManager.getScore();
			this.stateBus.publish("game-over");
			this.showComponent();
			this.showStatic();
		});

		this.stateBus.subscribe("game_over", () => {
			this.finalScoreHolder.innerHTML = this.scoreManager.getScore();
			this.showComponent();
			this.showStatic();
		});

		this.stateBus.subscribe("restart_game", () => {
			this.hideComponent();
			// this.hideStatic();
		});

		this.stateBus.subscribe("back_to_home", () => {
			this.hideComponent();
		});
	}

	restart() {
		this.stateManager.restartGame();
	}

	backToHome() {
		this.stateManager.resetState();
	}
}

export { GameOverComponent };
