import { Obstacle } from "../Obstacle.js";
import { UTIL } from "../../../../../../../Util/UTIL.js";
import { Vec3, Box, Body } from "../../../../../../../../libs/cannon-es.js";

class Kermit extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.scene = this.context.gameWorld.scene;
		this.modelLength = 37;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();
		this.time = new THREE.Clock();

		this.settings = {
			kermitColliderMass: 0,
		};

		this.modelUrl =
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/Kermit/Model/car.glb";

		this.loadKermit();
	}

	async loadKermit() {
		this.kermitFull = await this.loadObstacle(this.modelUrl);

		let kermitMesh = this.kermitFull.model;
		// let kermitAnimations = this.kermitFull.animations;

		// this.mixer = new THREE.AnimationMixer(kermitMesh);
		// let clips = kermitAnimations;

		// kermitMesh.position.set(0, 0, this.spawnPosition.z);
		kermitMesh.scale.setScalar(0.75);
		this.kermitMesh = kermitMesh;

		this.scene.add(this.kermitMesh);

		// this.runClip = THREE.AnimationClip.findByName(clips, "Skeleton_Running");

		// if (this.mixer) {
		// 	this.runAction = this.mixer.clipAction(this.runClip);
		// 	this.runAction.timeScale = 1.75;
		// }

		// if (this.runAction) this.runAction.play();

		this.attachCollider(this.kermitMesh);
		requestAnimationFrame(this.update.bind(this));
	}

	async loadObstacle(url) {
		let { model, animations } = await UTIL.loadModel(url);

		return { model, animations };
	}

	/*
    gotta refactor this method to take in a glb collider and stuff
    */
	attachCollider(parentMesh) {
		const halfExtents = new Vec3(0.3, 0.75, 0.01);
		const boxShape = new Box(halfExtents);
		let kermitCollider = new Body({
			mass: this.settings.kermitColliderMass,
			material: this.physicsMaterial,
			type: Body.KINEMATIC,
		});
		kermitCollider.addShape(boxShape);
		kermitCollider.position.z = parentMesh.position.z;
		// kermitCollider.position.y = parentMesh.position.y + 1;

		this.context.world.addBody(kermitCollider);
		this.collider = kermitCollider;

		this.setupEventListners(kermitCollider);
	}

	setupEventListners() {
		const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		const upAxis = new Vec3(0, 1, 0);
		const fwdAxis = new Vec3(0, 0, 1);
		this.collider.addEventListener("collide", (event) => {
			const { contact } = event;

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.context.playerCollider.id) {
				// bi is the player body, flip the contact normal
				return;
			}
		});
	}

	updatePosition(placementPostion) {
		if (!this.collider) return;

		this.collider.position.z = placementPostion.z;
		this.kermitMesh.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.collider.position.z +=
			(this.modelLength / 2) * this.delta.getDelta() * 2;
		this.kermitMesh.position.z = this.collider.position.z;
		this.collider.position.y = this.kermitMesh.position.y + 1;
		this.collider.position.x = this.kermitMesh.position.x;

		// if (this.mixer) this.mixer.update(this.time.getDelta());
	}

	clone() {
		return new Kermit(this.context, this.spawnPosition);
	}
}

export { Kermit };
