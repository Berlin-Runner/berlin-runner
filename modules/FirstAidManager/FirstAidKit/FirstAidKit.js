import { FirstAid } from "../FirstAid.js";

import {
	Vec3,
	Body,
	Sphere,
	Box,
	Quaternion,
	BODY_TYPES,
} from "../../../libs/cannon-es.js";

import { BaseAudioComponent } from "../../AudioManager/BaseAudioComponent.js";

class FirstAidKit extends FirstAid {
	constructor(context, spawnPosition) {
		super(context);

		this.modelLength = 37;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();

		this.settings = {
			mass: 0,
		};

		this.audioComponent = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/success.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.125,
		});

		this.modelUrl =
			"modules/FirstAidManager/FirstAidKit/model/first-aid-kit.glb";

		this.firdtAidKit = this.initFirstAidKit(this.modelUrl).then((res) => {
			console.log("sup freak bitches");
			res.position.set(0, 0.5, this.spawnPosition.z);

			this.scene.add(res);

			this.kitMesh = res;

			this.attachCollider(res);

			this.update();
		});
	}

	attachCollider(parentMesh) {
		const halfExtents = new Vec3(0.3, 0.3, 0.2);
		const boxShape = new Box(halfExtents);
		let kitCollider = new Body({
			mass: this.settings.mass,
		});
		kitCollider.addShape(boxShape);
		kitCollider.position.z = parentMesh.position.z;
		kitCollider.position.y = parentMesh.position.y;

		this.context.world.addBody(kitCollider);
		this.collider = kitCollider;

		this.setupEventListners(kitCollider);
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
				this.audioComponent.play();
				this.healthBus.publish("add-healing", 1 / 5);
				console.log("player touched health");
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
		this.collider.position.x = placementPostion.x;

		console.log(placementPostion);
		// this.obstacleMesh.position.y = placementPostion.y;);
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.kitMesh.rotation.y += 0.05;

		this.collider.position.z += (this.modelLength / 2) * this.delta.getDelta();
		this.kitMesh.position.z = this.collider.position.z;
		this.kitMesh.position.x = this.collider.position.x;
		// this.collider.position.y = this.kitMesh.position.y;
		// this.collider.position.x = this.kitMesh.position.x;
	}

	clone() {
		return new FirstAidKit(this.context, this.spawnPosition);
	}
}

export { FirstAidKit };
