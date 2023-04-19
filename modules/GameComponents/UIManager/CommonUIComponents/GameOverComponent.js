import { BaseUIComponent } from "../BaseUIComponent.js";
class GameOverComponent extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);
		this.camera = this.context.gameWorld.camera;

		this.restartLevelButton = document.getElementById("restart-level-button");
		this.backToHomeButton = document.getElementById("back-to-home-button");
		this.selectCharacterButton = document.querySelector(
			"#select-character-button"
		);

		this.gameOverMessage = document.querySelector("#game-over-message");
		this.gameOverMessage.style.display = "none";
		this.rewardMessage = document.querySelector("#reward-claim-message");
		this.rewardMessage.style.display = "none";

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

		this.selectCharacterButton.addEventListener("click", () => {
			this.selectCharacter();
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
			document.getElementById("in-play-screen").style.display = " none";
			if (this.scoreManager.getScore() < 10) {
				this.gameOverMessage.style.display = "flex";
			} else {
				this.rewardMessage.style.display = "flex";
			}
			this.showComponent();
			this.showStatic();
		});

		this.stateBus.subscribe("restart_game", () => {
			this.hideComponent();
			document.getElementById("in-play-screen").style.display = " flex";

			this.gameOverMessage.style.display = "none";
			this.rewardMessage.style.display = "none";
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

	selectCharacter() {
		this.hideComponent();
		gsap.to(this.camera.position, {
			x: 0,
			y: 50,
			z: -110,
			duration: 0,
		});
		gsap.to(this.camera.rotation, { x: 0, y: 0, z: 0, duration: 0.75 });
		this.stateBus.publish("display-chracter-selector");
		this.context.gameStateManager.showCharacterPicker();
	}
}

export { GameOverComponent };
