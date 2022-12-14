class GameStateManager {
	constructor(context) {
		this.context = context;

		this.gameStates = {
			notStartedYet: "not_started",
			pickingDistrict: "picking-district",
			started: "started",
			inPlay: "in_play",
			paused: "paused",
			over: "game_over",
		};

		this.init();
	}

	init() {
		this.currentState = this.gameStates.notStartedYet;
	}

	resetState() {
		this.currentState = this.gameStates.notStartedYet;
		this.context.gameStateEventBus.publish("back_to_home");
	}

	showPicker() {
		this.currentState = this.gameStates.pickingDistrict;
		this.context.gameStateEventBus.publish("pick-district");
	}

	startGame(districtIndex) {
		this.currentState = this.gameStates.started;
		this.context.gameStateEventBus.publish("start_game", districtIndex);
	}

	enterPlay() {
		this.currentState = this.gameStates.inPlay;
		this.scoreContainer = document.getElementById("score-holder");
		this.scoreContainer.style.display = "flex";
		this.context.gameStateEventBus.publish("enter_play");
	}

	pauseGame() {
		this.currentState = this.gameStates.paused;
		this.context.gameStateEventBus.publish("pause_game");
	}

	resumeGame() {
		this.currentState = this.gameStates.inPlay;
		this.context.gameStateEventBus.publish("resume_game");
	}

	restartGame() {
		this.currentState = this.gameStates.inPlay;
		this.context.gameStateEventBus.publish("restart_game");
	}

	gameOver() {
		this.currentState = this.gameStates.over;
		this.context.gameStateEventBus.publish("game_over");
	}

	update() {}
}

export { GameStateManager };
