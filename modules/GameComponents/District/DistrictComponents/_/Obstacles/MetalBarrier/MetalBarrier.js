import { Obstacle } from "../Obstacle.js";

import { Vec3, Body, Box } from "../../../../../../../../libs/cannon-es.js";

import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";

class MetalBarrier extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.modelLength = this.context.G.TILE_LENGTH;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();

		this.settings = {
			obstacleColliderMass: 0,
		};

		this.audioComponent = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/oooo.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.125,
		});

		this.modelUrl =
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/MetalBarrier/Model/MetalBarrier.glb";
		// "assets/models/chairThingy.glb";
		//
		// this.obstacleMesh = null;
		this.metalBarrier = this.initObstacle(this.modelUrl);
		this.metalBarrier.then((res) => {
			// res.scale.setScalar(0.25);
			res.position.set(0, 0.525, this.spawnPosition.z);
			res.rotation.set(0, (90 * Math.PI) / 180, 0);
			// this.context.gameWorld.scene.add(res);

			this.obstacleMesh = res;

			// console.log(this.context);

			this.attachCollider(res);
			requestAnimationFrame(this.update.bind(this));
		});
	}

	attachCollider(parentMesh) {
		const halfExtents = new Vec3(0.7, 0.35, 0.002);
		const boxShape = new Box(halfExtents);
		let obstacleCollider = new Body({
			mass: this.settings.obstacleColliderMass,
			material: this.physicsMaterial,
		});
		obstacleCollider.addShape(boxShape);
		obstacleCollider.position.z = parentMesh.position.z;
		obstacleCollider.position.y = parentMesh.position.y;

		this.context.world.addBody(obstacleCollider);
		this.collider = obstacleCollider;
		// console.log(obstacleCollider.position);
		this.setupEventListners(obstacleCollider);
	}

	setupEventListners(collider) {
		const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		const upAxis = new Vec3(0, 1, 0);
		const fwdAxis = new Vec3(0, 0, 1);
		this.collider.addEventListener("collide", (event) => {
			const { contact } = event;

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.context.playerCollider.id) {
				// bi is the player body, flip the contact normal

				this.healthBus.publish("add-damage", 1 / 4);
				this.audioComponent.play();
				// this.metalBarrier.visible = false;
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
		this.obstacleMesh.position.x = placementPostion.x;
		// this.obstacleMesh.position.y = placementPostion.y;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.collider.position.z += (this.modelLength / 2) * this.delta.getDelta();
		this.obstacleMesh.position.z = this.collider.position.z;
		this.collider.position.y = this.obstacleMesh.position.y;
		this.collider.position.x = this.obstacleMesh.position.x;
	}
}

export { MetalBarrier };
