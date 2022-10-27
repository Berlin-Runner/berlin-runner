import { Vec3, Body, Sphere } from "../../../libs/cannon-es.js";
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
			playerScale: 0.275,

			colliderDimensions: new Vec3(0.2, 0.6, 0.2),
			playerColliderMass: 167,
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

		this.setupEventListners();
		this.thirdPersonCamera = new Camer3rdPerson(this.context, this.player);
		this.movementManager = new MovementFSM(this.context, this.player);

		this.setupEventSubscriptions();
	}

	initCharachterCollider() {
		const halfExtents = this.settings.colliderDimensions;
		// const boxShape = new Box(halfExtents);
		const boxShape = new Sphere(0.6);
		this.context.playerCollider = new Body({
			mass: this.settings.playerColliderMass,
			material: this.physicsMaterial,
		});
		this.context.playerCollider.addShape(boxShape);
		this.context.playerCollider.position = threeToCannonVec3(
			this.player.position
		);
		this.context.playerCollider.linearDamping =
			this.settings.playerLinearDampeneingFactor;
		this.context.playerCollider.allowSleep = false;
		this.context.world.addBody(this.context.playerCollider);

		// console.log(this.context.playerCollider);
	}

	setupEventListners() {
		const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		const upAxis = new Vec3(0, 1, 0);
		this.cannonBody.addEventListener("collide", (event) => {
			const { contact } = event;

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.cannonBody.id) {
				// bi is the player body, flip the contact normal
				contact.ni.negate(contactNormal);
			} else {
				// bi is something else. Keep the normal as it is
				contactNormal.copy(contact.ni);
			}

			// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
			if (contactNormal.dot(upAxis) > 0.5) {
				// console.log("collision is heard");
				// Use a "good" threshold value between 0 and 1 here!
				this.canJump = true;
			}
		});
	}

	setupEventSubscriptions() {
		this.context.settingEventBus.subscribe("go-hands-free", (val) => {
			this.settings.cameraFollow = !val;
		});
	}

	async loadPlayerModel() {
		let { model, animations } = await UTIL.loadModel(
			"/assets/models/coach.glb"
		);

		return { model, animations };
	}

	async addPlayerMesh() {
		this.player = new THREE.Group();
		let playerModelFull = await this.loadPlayerModel();

		let playerMesh = playerModelFull.model;
		let playerAnimation = playerModelFull.animations;

		this.mixer = new THREE.AnimationMixer(playerMesh);
		let clips = playerAnimation;

		this.player.add(playerMesh);
		this.player.rotation.set(0, Math.PI, 0);
		this.player.scale.setScalar(this.settings.playerScale);

		this.runClip = THREE.AnimationClip.findByName(clips, "RUN");
		this.haltClip = THREE.AnimationClip.findByName(clips, "SALSA");
		this.deadClip = THREE.AnimationClip.findByName(clips, "SALSA");

		if (this.mixer) {
			this.runAction = this.mixer.clipAction(this.runClip);
			this.stopAction = this.mixer.clipAction(this.haltClip);
			this.deadAction = this.mixer.clipAction(this.deadClip);
		}

		this.deadAction.setLoop(THREE.LoopOnce);
		this.runAction.play();

		this.scene.add(this.player);
	}

	update() {
		if (this.settings.cameraFollow) {
			this.thirdPersonCamera.update();
		}
		if (this.mixer) this.mixer.update(this.context.time.getDelta());
		if (this.movementManager) this.movementManager.update();
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("PLAYER SETTINGS");
		/*
		this.localSettings.add(this.settings, "cameraFollow").onChange((value) => {
			this.settings.cameraFollow = value;
			console.log(`camera follow : ${this.settings.cameraFollow}`);
		}); */

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
