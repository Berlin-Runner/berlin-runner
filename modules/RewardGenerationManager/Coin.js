import {
	Vec3,
	Body,
	Sphere,
	Box,
	Quaternion,
	BODY_TYPES,
} from "../../libs/cannon-es.js";
import { BaseAudioComponent } from "../AudioManager/BaseAudioComponent.js";

class Coin {
	constructor(context, spawnPosition) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.scoreBus = this.context.scoreEventBus;

		this.spawnPosition = spawnPosition;

		this.modelLength = 37;

		this.delta = new THREE.Clock();

		this.settings = {
			coinColliderMass: 0.0,
		};

		this.audioComponent = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/ding.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.125,
		});

		this.init();

		this.addClassSettings();
	}

	init() {
		let coinGeo = new THREE.CylinderGeometry(0.125, 0.25, 0.1, 16);
		let coinMaterial = THREE.extendMaterial(THREE.MeshStandardMaterial, {
			class: THREE.CustomMaterial,
		});
		coinMaterial.uniforms.diffuse.value = new THREE.Color("blue");
		this.coinMesh = new THREE.Mesh(coinGeo, coinMaterial);
		this.coinMesh.position.copy(this.spawnPosition);
		this.coinMesh.rotation.x = 90 * (Math.PI / 180);

		this.scene.add(this.coinMesh);

		this.attachCoinCollider(this.spawnPosition);
		this.update();
	}

	attachCoinCollider(colliderPosition) {
		const halfExtents = new Vec3(0.25, 0.25, 0.02);
		const boxShape = new Box(halfExtents);
		let coinCollider = new Body({
			mass: this.settings.coinColliderMass,
			material: this.physicsMaterial,
			type: Body.STATIC,
		});
		coinCollider.addShape(boxShape);
		coinCollider.position = new Vec3(
			colliderPosition.x,
			colliderPosition.y,
			colliderPosition.z
		);
		this.context.world.addBody(coinCollider);
		this.collider = coinCollider;
		this.setupEventListners(coinCollider);
	}

	setupEventListners(collider) {
		const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		const upAxis = new Vec3(0, 1, 0);
		const fwdAxis = new Vec3(0, 0, 1);
		collider.addEventListener("collide", (event) => {
			const { contact } = event;
			if (contact.bi.id === this.context.playerCollider.id) {
				this.scoreBus.publish("add-score", 1);
				this.audioComponent.play();
				return;
			}
		});
	}

	detectsCollisionWithCoach() {}

	getCoin() {
		return this.coinMesh;
	}

	updatePosition(placementPostion) {
		this.collider.position.z = placementPostion.z;
		this.coinMesh.position.x = placementPostion.x;
		this.coinMesh.position.y = placementPostion.y;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.coinMesh.rotation.z += 0.1;

		this.collider.position.z += this.modelLength * 0.5 * this.delta.getDelta();
		this.coinMesh.position.z = this.collider.position.z;
		this.collider.position.y = this.coinMesh.position.y;
		this.collider.position.x = this.coinMesh.position.x;
	}

	addClassSettings() {
		/* this.localSettings = this.context.gui.addFolder("COIN SETTINGS");
		this.localSettings
			.add(this.audioComponent, "volume", 0, 1, 0.0124)
			.onChange((value) => {
				this.audioComponent.volume = value;
			}); */
	}

	clone() {
		return new Coin(this.context, this.spawnPosition);
	}
}

function cannonToThreeVec3(cannonvec3) {
	return new THREE.Vector3(cannonvec3.x, cannonvec3.y, cannonvec3.z);
}

function threeToCannonVec3(threeVec3) {
	return new Vec3(threeVec3.x, threeVec3.y, threeVec3.z);
}

export { Coin };
