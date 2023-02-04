export default class AnimationManager {
	constructor(context, mesh, animations) {
		this.context = context;

		this.playerMesh = mesh;
		this.animations = animations;

		this.settings = {
			"use default duration": true,
		};

		this.init();
	}

	init() {
		this.mixer = new THREE.AnimationMixer(this.playerMesh);
		this.context.mixer = this.mixer;

		this.initializeAnimations(this.animations);

		this.context.currentAction = this.context.playerActions.idleAction;
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
		let startAction = this.context.currentAction;
		let endAction = this.context.playerActions[endAction_];

		const duration = this.setCrossFadeDuration(defaultDuration);

		this.executeCrossFade(startAction, endAction, duration);
	}

	setCrossFadeDuration(defaultDuration) {
		if (this.settings["use default duration"]) {
			return defaultDuration;
		} else {
			return this.settings["set custom duration"];
		}
	}

	executeCrossFade(startAction, endAction, duration) {
		this.setWeight(endAction, 1);
		endAction.time = 0;

		startAction.crossFadeTo(endAction, duration, true);
		this.context.currentAction = endAction;
	}

	setWeight(action, weight) {
		action.enabled = true;
		action.setEffectiveTimeScale(1);
		action.setEffectiveWeight(weight);
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
			this.manager.prepareCrossFade("runAction", "idleAction", 0);
			this.currentState = this.playerAnimationStates.idle;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("enter_stage", () => {
			this.manager.prepareCrossFade("runAction", "idleAction", 0);
			this.currentState = this.playerAnimationStates.idleAction;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("enter_play", () => {
			this.manager.setWeight(this.context.playerActions["idleAction"], 0);
			this.manager.prepareCrossFade("runAction", "runAction", 0);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("pause_game", () => {
			this.manager.prepareCrossFade("runAction", "idleAction", 0);
			this.currentState = this.playerAnimationStates.idle;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("resume_game", () => {
			this.manager.prepareCrossFade("runAction", "runAction", 0);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("restart_game", () => {
			this.manager.prepareCrossFade("idleAction", "runAction", 0);
			this.currentState = this.playerAnimationStates.running;
			this.updatePlayerState();
		});

		this.stateBus.subscribe("game_over", () => {
			this.manager.prepareCrossFade("runAction", "deadAction", 0.5);
			this.currentState = this.playerAnimationStates.falling;
			this.updatePlayerState();
			this.context.mixer.addEventListener("finished", () => {
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
