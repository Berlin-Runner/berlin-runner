import {
	Vec3,
	Body,
	Sphere,
	Box,
	Cylinder,
	BODY_TYPES,
} from "../../../libs/cannon-es.js";
import { MovementFSM } from "./MovementFSM.js";
import { Camer3rdPerson } from "./Camera3rdPerson.js";

import { UTIL } from "../../Util/UTIL.js";

class Player {
	constructor(context) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.scene = this.context.gameWorld.scene;

		this.runAction = null;
		this.stopAction = null;
		this.deadAction = null;
		this.runClip = null;
		this.haltClip = null;
		this.deadClip = null;
		this.mixer = null;

		this.player = null;

		this.settings = {
			cameraFollow: true,

			playerScale: 0.9,

			colliderDimensions: new Vec3(0.2, 1, 0.2),
			playerColliderMass: 100,
			playerInitialPosition: new Vec3(0, 0, 0),
			playerLinearDampeneingFactor: 0,
		};

		this.init();

		this.addClassSettings();
	}

	init() {
		this.addPlayerMesh();
		this.initCharachterCollider();

		this.cannonBody = this.context.playerCollider;

		this.thirdPersonCamera = new Camer3rdPerson(this.context, this.player);
		this.movementManager = new MovementFSM(this.context, this.player);

		this.setupEventSubscriptions();
	}

	initCharachterCollider() {
		const halfExtents = this.settings.colliderDimensions;
		const boxShape = new Box(halfExtents);
		this.context.playerCollider = new Body({
			mass: this.settings.playerColliderMass,
			material: this.physicsMaterial,
		});
		this.context.playerCollider.quaternion.setFromAxisAngle(
			new Vec3(0, 1, 0),
			90
		);
		this.context.playerCollider.addShape(boxShape);
		this.context.playerCollider.position = threeToCannonVec3(
			this.player.position
		);
		this.context.playerCollider.linearDamping =
			this.settings.playerLinearDampeneingFactor;
		this.context.playerCollider.allowSleep = false;
		this.context.world.addBody(this.context.playerCollider);
	}

	setupEventSubscriptions() {
		this.context.settingEventBus.subscribe("go-hands-free", (val) => {
			this.settings.cameraFollow = !val;
		});
	}

	async loadPlayerModel() {
		let { model, animations } = await UTIL.loadModel(
			"/assets/models/the-girl.glb"
		);

		return { model, animations };
	}

	async addPlayerMesh() {
		this.player = new THREE.Group();
		let playerModelFull = await this.loadPlayerModel();

		let playerMesh = playerModelFull.model;
		let playerAnimation = playerModelFull.animations;

		this.mixer = new THREE.AnimationMixer(playerMesh);
		this.context.mixer = this.mixer;
		let clips = playerAnimation;

		this.player.add(playerMesh);
		this.player.rotation.set(0, Math.PI, 0);
		this.player.scale.setScalar(this.settings.playerScale);
		this.player.position.set(0, 0, 0);

		console.log(this.player);

		this.context.__PM__ = playerMesh.children[0].children[1];
		console.log(this.context.__PM__);
		// this.context.__PM__ = this.scene.getObjectByName("Character");
		// console.log(playerMesh.children[0].children[1]);
		this.context.__PM__.geometry.computeBoundingBox();
		this.context.__PM__.scale.set(0.5, 0.75, 1);
		this.context.playerBB = new THREE.Box3();
		this.context.playerBB.setFromObject(this.context.__PM__);
		console.log(this.context.playerBB);

		const box = new THREE.Box3Helper(this.context.playerBB, 0x0000ff);

		// this.context.gameWorld.scene.add(box);x

		// this.context.__PM__.matrixWorldNeedsUpdate = true;

		// box.scale.setScalar(this.settings.playerScale);
		// box.position.set(0, 1, 0);

		this.runClip = THREE.AnimationClip.findByName(clips, "Running");
		this.fallClip = THREE.AnimationClip.findByName(clips, "Fall");
		this.deadClip = THREE.AnimationClip.findByName(clips, "Dying");
		this.idleClip = THREE.AnimationClip.findByName(clips, "Idle");
		this.jumpClip = THREE.AnimationClip.findByName(clips, "Jump");
		this.slideClip = THREE.AnimationClip.findByName(clips, "Running slide");

		if (this.mixer) {
			this.runAction = this.mixer.clipAction(this.runClip);
			this.fallAction = this.mixer.clipAction(this.fallClip);
			this.deadAction = this.mixer.clipAction(this.deadClip);
			this.deadAction.setLoop(THREE.LoopOnce, 2);
			this.ideleAction = this.mixer.clipAction(this.idleClip);
			this.jumpAction = this.mixer.clipAction(this.jumpClip);
			this.jumpAction.setLoop(THREE.LoopOnce, 1);
			this.slideAction = this.mixer.clipAction(this.slideClip);
			this.slideAction.setLoop(THREE.LoopOnce, 1);
		}

		this.context.zenBenActions = [
			this.runAction,
			this.fallAction,
			this.deadAction,
			this.ideleAction,
			this.jumpAction,
			this.slideAction,
		];

		this.context.currentAction = this.runAction;
		this.context.currentPlayerAnimationState = 0;

		this.context.currentAction.play();

		this.scene.add(this.player);
	}

	fadeToAction(index, duration, timeScale = 1) {
		if (!this.context.zenBenActions) return;
		this.context.previousAction = this.context.currentAction;
		this.context.currentAction = this.context.zenBenActions[index];

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
		if (this.settings.cameraFollow) {
			this.thirdPersonCamera.update();
		}
		if (this.mixer != undefined && this.mixer != null)
			this.mixer.update(this.context.time.getDelta());
		if (this.movementManager) this.movementManager.update();

		if (this.context.playerBB && this.context.playerInstance) {
			this.context.playerBB
				.copy(this.context.__PM__.geometry.boundingBox)
				.applyMatrix4(this.context.__PM__.matrixWorld);
		}
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("PLAYER SETTINGS");

		this.localSettings
			.add(this.settings, "playerScale", 0, 1)
			.onChange((value) => {
				this.player.scale.setScalar(value);
			})
			.name("PLAYER-SCALE");

		let playerPhysicsSettings = this.localSettings.addFolder(
			"PLAYER-PHHYSICS-SETTINGS"
		);

		let colliderDimensions = playerPhysicsSettings.addFolder(
			"COLLIDER-DIMENSIONS"
		);
		colliderDimensions.add(this.settings.colliderDimensions, "x", 0, 1, 0.001);
		colliderDimensions.add(this.settings.colliderDimensions, "y", 0, 1, 0.001);
		colliderDimensions.add(this.settings.colliderDimensions, "z", 0, 1, 0.001);

		colliderDimensions.open();

		playerPhysicsSettings
			.add(this.settings, "playerColliderMass", 0, 100, 1)
			.onChange((value) => {
				this.context.playerCollider.mass = value;
			})
			.name("MASS");

		playerPhysicsSettings
			.add(this.settings, "playerLinearDampeneingFactor", 0, 1, 0.001)
			.onChange((value) => {
				this.context.playerCollider.linearDamping = value;
			})
			.name("DAMPING");

		playerPhysicsSettings.open();

		this.localSettings.open();
	}
}

function cannonToThreeVec3(cannonvec3) {
	return new THREE.Vector3(
		cannonToThreejsVec3.x,
		cannonToThreejsVec3.y,
		cannonToThreejsVec3.z
	);
}

function threeToCannonVec3(cannonvec3) {
	return new Vec3(
		threeToCannonVec3.x,
		threeToCannonVec3.y,
		threeToCannonVec3.z
	);
}

export { Player };
