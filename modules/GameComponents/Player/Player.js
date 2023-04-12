import { Vec3, Body, Box } from "../../../libs/cannon-es.js";
import { MovementFSM } from "./MovementFSM.js";
import { Camer3rdPerson } from "./Camera3rdPerson.js";

import AnimationManager from "./AnimationManager.js";

class Player {
	constructor(context, playerModel) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.scene = this.context.gameWorld.scene;

		this.player = null;
		this.playerModel = playerModel;

		this.settings = {
			cameraFollow: true,
			playerScale: 0.9,
			colliderDimensions: new Vec3(0.2, 1, 0.2),
			playerColliderMass: 100,
			playerInitialPosition: new Vec3(0, 0, 0),
			playerLinearDampeneingFactor: 0,

			debugAABB: false,

			player: "ben",
		};

		this.init();

		this.addClassSettings();
	}

	async init() {
		await this.addPlayerMesh(this.playerModel);

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

	async addPlayerMesh(player) {
		this.player = new THREE.Group();
		this.player.position.set(0, 0, 0);

		let playerModelFull = player;
		let playerMesh = playerModelFull.model;
		let playerAnimation = playerModelFull.animations;

		this.initPlayerBB(playerMesh);

		this.player.add(playerMesh);
		this.player.rotation.set(0, Math.PI, 0);
		this.player.scale.setScalar(0.25);
		// this.context.cityContainer.add(this.player); // the player is the child of the city container
		this.scene.add(this.player);

		this.animationManager = new AnimationManager(
			this.context,
			playerMesh,
			playerAnimation
		);

		this.context.animationManager = this.animationManager;
	}

	initPlayerBB(playerMesh) {
		this.context.__PM__ = playerMesh.getObjectByName("aabb");
		this.context.__PM__.visible = false;

		this.context.__PM__.geometry.computeBoundingBox();
		this.context.__PM__.scale.set(0.5, 0.75, 1);
		this.context.playerBB = new THREE.Box3();
		this.context.playerBB.setFromObject(this.context.__PM__);

		const box = new THREE.Box3Helper(this.context.playerBB, 0x0000ff);
		if (this.settings.debugAABB) this.scene.add(box);
	}

	update() {
		if (this.settings.cameraFollow) {
			this.thirdPersonCamera.update();
		}
		if (this.movementManager) this.movementManager.update();

		if (this.context.playerBB && this.context.playerInstance) {
			this.context.playerBB
				.copy(this.context.__PM__.geometry.boundingBox)
				.applyMatrix4(this.context.__PM__.matrixWorld);
		}

		requestAnimationFrame(this.update.bind(this));
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("PLAYER SETTINGS");

		this.localSettings
			.add(this.settings, "player", { ben: "ben ", lady: "lady" })
			.name("PLAYER")
			.onChange((val) => {
				this.addPlayerMesh(val);
			});

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
