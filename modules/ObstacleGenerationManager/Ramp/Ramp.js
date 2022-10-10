import { Obstacle } from "../Obstacle.js";

import {
	Vec3,
	Body,
	Sphere,
	Box,
	Quaternion,
	BODY_TYPES,
} from "../../../libs/cannon-es.js";

import { BaseAudioComponent } from "../../AudioManager/BaseAudioComponent.js";
import CannonUtils from "../../Util/CannonUtils.js";

class Ramp extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.modelLength = 37;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();

		this.settings = {
			rampColliderMass: 0,
		};

		this.modelUrl =
			"modules/ObstacleGenerationManager/Ramp/Model/slant-ramp.glb";

		this.slantRamp = this.initObstacle(this.modelUrl);
		this.slantRamp.then((res) => {
			// res.scale.setScalar(0.25);
			res.position.set(0, 0.125, this.spawnPosition.z);
			// res.material.wireframe = true;
			// res.rotation.set(0, (90 * Math.PI) / 180, 0);
			this.context.gameWorld.scene.add(res);

			this.rampMesh = res;

			// console.log(this.context);

			// this.attachCollider(res);
			this.cannonifyMeshGeometry(res, "ramp", BODY_TYPES.KINEMATIC, 1);
			this.update();
		});
	}

	cannonifyMeshGeometry(
		meshToBeCanonified,
		meshName,
		bodyType,

		bodyMass
	) {
		if (!meshToBeCanonified) {
			console.log(`uh oh the mesh ${meshName} seems to be problematic`);
			return;
		}

		let shape = CannonUtils.CreateTrimesh(meshToBeCanonified.geometry);

		let meshBody = new Body({
			type: bodyType,
			mass: bodyMass,
		});

		meshBody.addShape(shape);
		meshBody.position.copy(meshToBeCanonified.position);
		meshBody.quaternion.copy(meshToBeCanonified.quaternion);
		this.collider = meshBody;

		// if (collisionFilterGroup != 1)
		// 	meshBody.collisionFilterGroup = collisionFilterGroup;
		this.context.world.addBody(meshBody);
		this.setupEventListners();
	}

	/*
    gotta refactor this method to take in a glb collider and stuff
    */
	attachCollider(parentMesh) {
		const halfExtents = new Vec3(0.7, 0.35, 0.2);
		const boxShape = new Box(halfExtents);
		let rampCollider = new Body({
			mass: this.settings.rampColliderMass,
			material: this.physicsMaterial,
		});
		rampCollider.addShape(boxShape);
		rampCollider.position.z = parentMesh.position.z;
		rampCollider.position.y = parentMesh.position.y;

		this.context.world.addBody(rampCollider);
		this.collider = rampCollider;

		this.setupEventListners(rampCollider);
	}

	setupEventListners() {
		console.log("hii");
		const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		const upAxis = new Vec3(0, 1, 0);
		const fwdAxis = new Vec3(0, 0, 1);
		this.collider.addEventListener("collide", (event) => {
			const { contact } = event;

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.context.playerCollider.id) {
				console.log("encountered a slant ramp");
				// bi is the player body, flip the contact normal
				return;
			} else {
				// bi is something else. Keep the normal as it is
				contactNormal.copy(contact.ni);
			}

			// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
			if (contactNormal.dot(upAxis) > 0.5) {
				// console.log("collision is heard from the coin");
				// Use a "good" threshold value between 0 and 1 here!
				this.canJump = true;
			}
		});
	}

	updatePosition(placementPostion) {
		if (!this.collider) return;

		this.collider.position.z = placementPostion.z;
		this.rampMesh.position.x = placementPostion.x;
		// this.rampMesh.position.y = placementPostion.y;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.collider.position.z += (this.modelLength / 2) * this.delta.getDelta();
		this.rampMesh.position.z = this.collider.position.z;
		this.collider.position.y = this.rampMesh.position.y;
		this.collider.position.x = this.rampMesh.position.x;
	}

	clone() {
		return new Ramp(this.context, this.spawnPosition);
	}
}

export { Ramp };
