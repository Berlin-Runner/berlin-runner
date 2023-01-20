export default class AnimationManager {
	constructor(context, mesh, animations) {
		this.context = context;

		this.playerMesh = mesh;
		this.animations = animations;

		this.settings = {
			"use default duration": true,
		};

		this.init();

		console.log(animations);
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
			this.runAction.play();
			this.setWeight(this.runAction, 0);
			this.fallAction = this.mixer.clipAction(this.fallClip);
			this.fallAction.setLoop(THREE.LoopOnce, 0);
			this.fallAction.play();
			this.setWeight(this.fallAction, 0);
			this.deadAction = this.mixer.clipAction(this.deadClip);
			this.deadAction.setLoop(THREE.LoopOnce, 0);
			this.deadAction.play();
			this.setWeight(this.deadAction, 0);
			this.idleAction = this.mixer.clipAction(this.idleClip);
			// this.idleAction.setLoop(THREE.LoopOnce, 1);
			this.idleAction.play();
			this.setWeight(this.idleAction, 1);
			this.jumpAction = this.mixer.clipAction(this.jumpClip);
			this.jumpAction.setLoop(THREE.LoopOnce, 0);
			this.jumpAction.play();
			this.setWeight(this.jumpAction, 0);
			this.slideAction = this.mixer.clipAction(this.slideClip);
			this.slideAction.setLoop(THREE.LoopOnce, 0);
			this.slideAction.play();
			this.setWeight(this.slideAction, 0);
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

	prepareCrossFade(startAction_, endAction_, defaultDuration) {
		// Switch default / custom crossfade duration (according to the user's choice)
		// let startAction = this.context.playerActions[startAction_];
		console.log(
			"CURRENT ANIMATION NAME " + this.context.currentAction._clip.name
		);
		let startAction = this.context.currentAction;
		let endAction = this.context.playerActions[endAction_];

		const duration = this.setCrossFadeDuration(defaultDuration);

		// Make sure that we don't go on in singleStepMode, and that all actions are unpaused

		// singleStepMode = false;
		// this.unPauseAllActions();

		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop

		if (startAction === this.context.playerActions["idleAction"]) {
			this.executeCrossFade(startAction, endAction, duration);
		} else {
			// this.synchronizeCrossFade(startAction, endAction, duration);
			this.executeCrossFade(startAction, endAction, duration);
		}
	}

	setCrossFadeDuration(defaultDuration) {
		// Switch default crossfade duration <-> custom crossfade duration

		if (this.settings["use default duration"]) {
			return defaultDuration;
		} else {
			return this.settings["set custom duration"];
		}
	}

	synchronizeCrossFade(startAction, endAction, duration) {
		let onLoopFinished = (e) => {
			if (e.action === startAction) {
				this.mixer.removeEventListener("loop", onLoopFinished);

				this.executeCrossFade(startAction, endAction, duration);
			}
		};

		// this.executeCrossFade(startAction, endAction, duration);

		this.mixer.addEventListener("loop", onLoopFinished);
	}

	executeCrossFade(startAction, endAction, duration) {
		// Not only the start action, but also the end action must get a weight of 1 before fading
		// (concerning the start action this is already guaranteed in this place)

		// this.setWeight(startAction, 1);
		this.setWeight(endAction, 1);
		endAction.time = 0;

		// Crossfade with warping - you can also try without warping by setting the third parameter to false

		startAction.crossFadeTo(endAction, duration, true);
		this.context.currentAction = endAction;
	}

	// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
	// the start action's timeScale to ((start animation's duration) / (end animation's duration))

	setWeight(action, weight) {
		action.enabled = true;
		action.setEffectiveTimeScale(1);
		action.setEffectiveWeight(weight);
	}

	fadeToAction(name, duration, timeScale = 1) {
		if (!this.context.playerActions) return;
		this.context.previousAction = this.context.currentAction;
		this.context.currentAction = this.context.playerActions[name];

		if (this.context.previousAction != this.context.currentAction) {
			this.context.previousAction.fadeOut(duration);
		}
		if (!this.currentAction) return;
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

		this.currentState = this.playerAnimationStates.idle;
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
			this.manager.fadeToAction("runAction", 1);
			this.currentState = this.playerAnimationStates.idle;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("enter_stage", () => {
			console.log("captured enter_stage ");
			this.manager.fadeToAction("runAction", 1);
			this.currentState = this.playerAnimationStates.idleAction;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("enter_play", () => {
			// this.manager.fadeToAction("runAction", 0.1);
			this.manager.setWeight(this.context.playerActions["idleAction"], 0);
			this.manager.prepareCrossFade("runAction", "runAction", 0);
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
			// this.manager.fadeToAction("runAction", 0.1);
			this.manager.prepareCrossFade("idleAction", "runAction", 0);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("game_over", () => {
			// this.manager.fadeToAction("deadAction", 1);
			this.manager.prepareCrossFade("runAction", "deadAction", 0.5);
			this.currentState = this.playerAnimationStates.falling;
			this.updatePlayerState();
			this.context.mixer.addEventListener("finished", () => {
				// this.manager.fadeToAction("idleAction", 1);
				this.manager.prepareCrossFade("deadAction", "idleAction", 0);
				this.currentState = this.playerAnimationStates.idle;
				this.updatePlayerState();
			});
		});
	}

	updatePlayerState() {
		this.context.currentPlayerState = this.currentState;
	}
}

class AnimationManagerSample {
	constructor() {
		this.settings = {
			"use default duration": true,
		};
	}

	prepareCrossFade(startAction, endAction, defaultDuration) {
		// Switch default / custom crossfade duration (according to the user's choice)

		const duration = setCrossFadeDuration(defaultDuration);

		// Make sure that we don't go on in singleStepMode, and that all actions are unpaused

		// singleStepMode = false;
		unPauseAllActions();

		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop

		if (startAction === idleAction) {
			executeCrossFade(startAction, endAction, duration);
		} else {
			synchronizeCrossFade(startAction, endAction, duration);
		}
	}

	setCrossFadeDuration(defaultDuration) {
		// Switch default crossfade duration <-> custom crossfade duration

		if (settings["use default duration"]) {
			return defaultDuration;
		} else {
			return settings["set custom duration"];
		}
	}

	synchronizeCrossFade(startAction, endAction, duration) {
		mixer.addEventListener("loop", onLoopFinished);

		let onLoopFinished = (event) => {
			if (event.action === startAction) {
				mixer.removeEventListener("loop", onLoopFinished);

				executeCrossFade(startAction, endAction, duration);
			}
		};
	}

	executeCrossFade(startAction, endAction, duration) {
		// Not only the start action, but also the end action must get a weight of 1 before fading
		// (concerning the start action this is already guaranteed in this place)

		setWeight(endAction, 1);
		endAction.time = 0;

		// Crossfade with warping - you can also try without warping by setting the third parameter to false

		startAction.crossFadeTo(endAction, duration, true);
	}

	// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
	// the start action's timeScale to ((start animation's duration) / (end animation's duration))

	setWeight(action, weight) {
		action.enabled = true;
		action.setEffectiveTimeScale(1);
		action.setEffectiveWeight(weight);
	}
}
