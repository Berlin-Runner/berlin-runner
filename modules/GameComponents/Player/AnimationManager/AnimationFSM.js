export default class AnimationFSM {
	constructor(context, animationManager) {
		this.context = context;
		this.stateBus = this.context.gameStateEventBus;
		this.manager = animationManager;

		this.playerAnimationStates = {
			running: 0,
			falling: 1,
			dead: 2,
			idle: 3,
			jumping: 4,
			sliding: 5,
		};

		this.context.playerAnimationStates = this.playerAnimationStates;

		this.currentState = this.playerAnimationStates.idle;
		this.context.currentPlayerState = this.currentState;

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("back_to_home", () => {});

		this.stateBus.subscribe("pick-district", () => {});

		this.stateBus.subscribe("start_game", () => this.onStartGame());

		this.stateBus.subscribe("enter_stage", () => this.onEnterStage());

		this.stateBus.subscribe("enter_play", () => this.onEnterPlay());

		this.stateBus.subscribe("pause_game", () => this.onPauseGame());

		this.stateBus.subscribe("resume_game", () => this.onResumeGame());

		this.stateBus.subscribe("restart_game", () => this.onRestartGame());

		this.stateBus.subscribe("game_over", () => this.onGameOver());
	}

	onStartGame() {
		this.manager.prepareCrossFade("_", "idleAction", 0);
		this.currentState = this.playerAnimationStates.idle;
		this.updatePlayerState();
	}

	onEnterStage() {
		this.manager.prepareCrossFade("_", "idleAction", 0);
		this.currentState = this.playerAnimationStates.idleAction;
		this.updatePlayerState();
	}

	onEnterPlay() {
		// this.manager.setWeight(this.context.playerActions["idleAction"], 0);
		this.manager.prepareCrossFade("idleAction", "runAction", 0);
		this.currentState = this.playerAnimationStates.running;
		this.updatePlayerState();
	}

	onPauseGame() {
		this.manager.prepareCrossFade("runAction", "idleAction", 0);
		this.currentState = this.playerAnimationStates.idle;
		this.updatePlayerState();
	}

	onResumeGame() {
		this.manager.prepareCrossFade("runAction", "runAction", 0);
		this.currentState = this.playerAnimationStates.running;
		this.updatePlayerState();
	}

	onRestartGame() {
		this.manager.prepareCrossFade("idleAction", "runAction", 0);
		this.currentState = this.playerAnimationStates.running;
		this.updatePlayerState();
	}

	onGameOver() {
		this.manager.prepareCrossFade("runAction", "deadAction", 0.5);
		this.currentState = this.playerAnimationStates.falling;
		this.updatePlayerState();
		this.context.mixer.addEventListener("finished", () => {
			this.manager.prepareCrossFade("deadAction", "idleAction", 0);
			this.currentState = this.playerAnimationStates.idle;
			this.updatePlayerState();
		});
	}

	updatePlayerState() {
		this.context.currentPlayerState = this.currentState;
	}
}
