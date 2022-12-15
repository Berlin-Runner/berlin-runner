export default class AnimationManager {
	constructor(context, mesh, animations) {
		this.context = context;

		this.playerMesh = mesh;
		this.animations = animations;

		this.init();
	}

	init() {
		this.mixer = new THREE.AnimationMixer(this.playerMesh);
		this.context.mixer = this.mixer;

		this.initializeAnimations(this.animations);

		this.context.currentAction = this.context.playerActions.runAction;
		this.context.currentPlayerAnimationState = 0;

		this.context.currentAction.play();

		this.aimationStateMachine = new AnimationFSM(this.context, this);

		this.update();
	}

	initializeAnimations(clips) {
		this.runClip = THREE.AnimationClip.findByName(clips, "Running");
		this.fallClip = THREE.AnimationClip.findByName(clips, "Fall");
		this.deadClip = THREE.AnimationClip.findByName(clips, "Dying");
		this.idleClip = THREE.AnimationClip.findByName(clips, "Idle");
		this.jumpClip = THREE.AnimationClip.findByName(clips, "Jump");
		this.slideClip =
			THREE.AnimationClip.findByName(clips, "Running slide") ||
			THREE.AnimationClip.findByName(clips, "Sliding");

		if (this.mixer) {
			this.runAction = this.mixer.clipAction(this.runClip);
			this.fallAction = this.mixer.clipAction(this.fallClip);
			this.fallAction.setLoop(THREE.LoopOnce, 1);
			this.deadAction = this.mixer.clipAction(this.deadClip);
			this.deadAction.setLoop(THREE.LoopOnce, 2);
			this.idleAction = this.mixer.clipAction(this.idleClip);
			this.jumpAction = this.mixer.clipAction(this.jumpClip);
			this.jumpAction.setLoop(THREE.LoopOnce, 1);
			this.slideAction = this.mixer.clipAction(this.slideClip);
			this.slideAction.setLoop(THREE.LoopOnce, 1);
		}

		this.context.playerActions = {
			runAction: this.runAction,
			fallAction: this.fallAction,
			deadAction: this.deadAction,
			idleAction: this.idleAction,
			jumpAction: this.jumpAction,
			slideAction: this.slideAction,
		};
	}

	fadeToAction(name, duration, timeScale = 1) {
		if (!this.context.playerActions) return;
		this.context.previousAction = this.context.currentAction;
		this.context.currentAction = this.context.playerActions[name];

		if (this.context.previousAction != this.context.currentAction) {
			this.context.previousAction.fadeOut(duration);
		}

		this.context.currentAction
			.reset()
			.setEffectiveTimeScale(timeScale)
			.setEffectiveWeight(1)
			.fadeIn(duration)
			.play();
	}

	restore(restoreDuration) {
		this.fadeToAction(
			this.context.currentPlayerAnimationState,
			restoreDuration
		);
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		if (this.mixer != undefined && this.mixer != null) {
			this.mixer.update(this.context.time.getDelta());
		}
	}
}

class AnimationFSM {
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

		this.currentState = this.playerAnimationStates.running;
		this.context.currentPlayerState = this.currentState;

		this.init();
	}

	init() {
		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("back_to_home", () => {});

		this.stateBus.subscribe("pick-district", () => {});

		this.stateBus.subscribe("start_game", () => {
			this.manager.fadeToAction("runAction", 0.1);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("enter_play", () => {
			this.manager.fadeToAction("runAction", 0.1);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("pause_game", () => {
			this.manager.fadeToAction("idleAction", 0.1);
			this.currentState = this.playerAnimationStates.idle;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("resume_game", () => {
			this.manager.fadeToAction("runAction", 0.1);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("restart_game", () => {
			this.manager.fadeToAction("runAction", 0.1);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("game_over", () => {
			this.manager.fadeToAction("deadAction", 1);
			this.currentState = this.playerAnimationStates.falling;
			this.updatePlayerState();
			this.context.mixer.addEventListener("finished", () => {
				this.manager.fadeToAction("idleAction", 1);
				this.currentState = this.playerAnimationStates.idle;
				this.updatePlayerState();
			});
		});
	}

	updatePlayerState() {
		this.context.currentPlayerState = this.currentState;
	}
}
