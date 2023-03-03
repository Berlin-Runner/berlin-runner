class GameStateManager {
	constructor(context) {
		this.context = context;

		this.gameStates = {
			notStartedYet: "not_started",
			pickingDistrict: "picking-district",
			pickingCharacter: "picking-character",
			started: "started",
			staged: "staged",
			inPlay: "in_play",
			paused: "paused",
			over: "game_over",
		};

		this.switch = false;

		this.init();
	}

	init() {
		this.currentState = this.gameStates.notStartedYet;
	}

	resetState() {
		this.currentState = this.gameStates.notStartedYet;
		this.context.gameStateEventBus.publish("back_to_home");
	}

	showCharacterPicker() {
		this.currentState = this.gameStates.pickingCharacter;
		this.context.gameStateEventBus.publish("pick-character");
	}

	showDistrictPicker() {
		this.currentState = this.gameStates.pickingDistrict;
		this.context.gameStateEventBus.publish("pick-district");
	}

	startGame(districtIndex) {
		this.currentState = this.gameStates.started;
		this.context.gameStateEventBus.publish("start_game", districtIndex);
	}

	enterStage() {
		this.currentState = this.gameStates.staged;
		this.context.gameStateEventBus.publish("enter_stage");
	}

	enterPlay() {
		this.currentState = this.gameStates.inPlay;
		document.getElementById("in-play-screen").style.display = "flex";
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

		this.context.cityContainer.children[0].position.z += 2;

		this.context.gameStateEventBus.publish("restart_game");
	}

	gameOver() {
		this.currentState = this.gameStates.over;
		this.context.gameStateEventBus.publish("game_over");
	}

	update() {}
}

export { GameStateManager };
