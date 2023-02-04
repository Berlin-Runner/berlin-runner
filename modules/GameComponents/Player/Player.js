import { Vec3, Body, Box } from "../../../libs/cannon-es.js";
import { MovementFSM } from "./MovementFSM.js";
import { Camer3rdPerson } from "./Camera3rdPerson.js";

import { UTIL } from "../../Util/UTIL.js";
import AnimationManager from "./AnimationManager.js";

class Player {
	constructor(context) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.scene = this.context.gameWorld.scene;

		this.player = null;

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
		await this.addPlayerMesh("ben");
		this.initCharachterCollider();

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
		// this.context.playerCollider.position = threeToCannonVec3(
		// 	this.player.position
		// );
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

	async loadBenModel() {
		let { model, animations } = await UTIL.loadModel(
			"/assets/models/zen-ben-v2.glb"
			// "/assets/models/the-girl.glb"
		);

		return { model, animations };
	}

	async loadLadyModel() {
		let { model, animations } = await UTIL.loadModel(
			// "/assets/models/zen-ben.glb"
			// "/assets/models/the-girl.glb"
			"/assets/models/kati.glb"
		);

		return { model, animations };
	}

	async initializePlayerModels() {
		this.ben = await this.loadBenModel();
		this.lady = await this.loadLadyModel();
	}

	async addPlayerMesh(player) {
		await this.initializePlayerModels();

		let playerModelFullBen;
		// let playerModelFullLady;
		this.player = new THREE.Group();
		// if (player === "ben") {
		// playerModelFull = await this.loadBenModel();
		playerModelFullBen = this.ben;
		playerModelFullBen.model.scale.setScalar(45);
		playerModelFullBen.model.position.set(0, 0, 0);
		// console.log(playerModelFull);
		// }
		// else if (player === "lady") {
		// playerModelFull = await this.loadLadyModel();
		// playerModelFullLady = this.lady;
		// playerModelFullLady.model.position.set(1, 0, 0);
		// }

		// console.log(playerModelFull);

		let playerMeshBen = playerModelFullBen.model;
		// let playerMeshLady = playerModelFullLady.model;
		let playerAnimationBen = playerModelFullBen.animations;
		// let playerAnimationLady = playerModelFullLady.animations;

		this.initPlayerBB(playerMeshBen);
		// this.initPlayerBB(playerMeshLady);

		this.player.add(playerMeshBen);
		// this.player.add(playerMeshLady);
		this.player.rotation.set(0, Math.PI, 0);
		// this.player.scale.setScalar(this.settings.playerScale);
		this.player.position.set(0, 0, 0);
		this.scene.add(this.player);

		this.animationManager = new AnimationManager(
			this.context,
			playerMeshBen,
			playerAnimationBen
		);
		// this.animationManagerLady = new AnimationManager(
		// 	this.context,
		// 	playerMeshLady,
		// 	playerAnimationLady
		// );

		this.context.animationManager = this.animationManager;
		// this.context.animationManagerLady = this.animationManagerLady;
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
		if (!this.player) return;
		if (this.settings.cameraFollow) {
			this.thirdPersonCamera.update();
		}
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
