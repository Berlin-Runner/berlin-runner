import { Vec3, Body, Box } from "../../../libs/cannon-es.js";
import PlayerController from "./PlayerController/PlayerController.js";
import AnimationManager from "./AnimationManager/AnimationManager.js";

class Player {
	constructor(context, playerModel, playerAnimations) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.scene = this.context.gameWorld.scene;

		this.player = null;
		this.playerModel = playerModel;
		this.playerAnimations = playerAnimations;

		this.cameraFollow = false;
		this.playerScale = 0.9;
		this.colliderDimensions = new Vec3(0.2, 1, 0.2);
		this.playerColliderMass = 100;
		this.playerInitialPosition = new Vec3(0, 0, 0);
		this.playerLinearDampeneingFactor = 0;
		this.debugAABB = false;
		this.playerName = "ben";

		this.movementManager = null;
		this.animationManager = null;

		this.init();
	}

	async init() {
		await this.addPlayerMesh(this.playerModel, this.playerAnimations);
		this.playerController = new PlayerController(this.context, this.player);
		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.context.settingEventBus.subscribe("go-hands-free", (val) => {
			this.cameraFollow = !val;
		});
	}

	async addPlayerMesh(player, animations) {
		this.player = new THREE.Group();
		this.player.position.set(0, 0, 0);

		let playerMesh = player;
		let playerAnimation = animations;

		this.initPlayerBB(playerMesh);

		this.player.add(playerMesh);
		this.player.rotation.set(0, Math.PI, 0);
		this.player.scale.setScalar(0.23);
		this.context.player = this.player;
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
		if (this.debugAABB) this.scene.add(box);
	}

	update() {
		if (this.playerController) this.playerController.update();

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
		colliderDimensions.add(this.colliderDimensions, "x", 0, 1, 0.001);
		colliderDimensions.add(this.colliderDimensions, "y", 0, 1, 0.001);
		colliderDimensions.add(this.colliderDimensions, "z", 0, 1, 0.001);

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

export { Player };
