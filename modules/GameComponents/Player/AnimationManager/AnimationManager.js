import AnimationFSM from "./AnimationFSM.js";
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

	initializeActions(clip, loop = THREE.LoopRepeat, weight = 0) {
		const action = this.mixer.clipAction(clip);
		action.setLoop(loop);
		action.play();
		this.setWeight(action, weight);
		return action;
	}

	initializeAnimations(clips) {
		const runClipNames = ["Running", "Run"];
		this.runClip = clips.find((clip) => runClipNames.includes(clip.name));

		const fallClipNames = ["Fall", "Falling"];
		this.fallClip = clips.find((clip) => fallClipNames.includes(clip.name));

		const deadClipNames = ["Dying", "Die"];
		this.deadClip = clips.find((clip) => deadClipNames.includes(clip.name));

		this.idleClip = THREE.AnimationClip.findByName(clips, "Idle");

		const jumpClipNames = ["Jump", "Running Jump"];
		this.jumpClip = clips.find((clip) => jumpClipNames.includes(clip.name));

		const slideClipNames = [
			"Running slide",
			"Sliding",
			"Running Slide",
			"Slide",
		];
		this.slideClip = clips.find((clip) => slideClipNames.includes(clip.name));

		if (this.mixer) {
			this.runAction = this.initializeActions(this.runClip);

			this.fallAction = this.initializeActions(this.fallClip, THREE.LoopOnce);
			this.deadAction = this.initializeActions(this.deadClip, THREE.LoopOnce);
			this.idleAction = this.initializeActions(this.idleClip);
			this.jumpAction = this.initializeActions(this.jumpClip, THREE.LoopOnce);
			this.slideAction = this.initializeActions(this.slideClip, THREE.LoopOnce);
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

	prepareCrossFade(startActionKey, endActionKey, defaultDuration) {
		const startAction =
			startActionKey == "_"
				? this.context.playerActions.runAction
				: this.context.currentAction;
		const endAction = this.context.playerActions[endActionKey];

		const duration = this.getCrossFadeDuration(defaultDuration);

		this.executeCrossFade(startAction, endAction, duration);
	}

	getCrossFadeDuration(defaultDuration) {
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
