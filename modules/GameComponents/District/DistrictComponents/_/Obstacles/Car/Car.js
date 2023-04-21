import { Obstacle } from "../Obstacle.js";
import { UTIL } from "../../../../../../../Util/UTIL.js";
import { Vec3, Box, Body } from "../../../../../../../../libs/cannon-es.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";

class Car extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.scene = this.context.gameWorld.scene;
		this.modelLength = this.context.G.TILE_LENGTH;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();
		this.time = new THREE.Clock();

		this.settings = {
			carColliderMass: 0,
		};

		this.audioComponent = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/oooo.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.125,
		});

		this.modelUrl =
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/Car/Model/car.glb";

		this.loadCar();
	}

	async loadCar() {
		this.carFull = await this.loadObstacle(this.modelUrl);

		let carMesh = this.carFull.model;

		carMesh.scale.setScalar(0.75);
		this.carMesh = carMesh;

		// this.scene.add(this.carMesh);

		this.attachCollider(this.carMesh);
		requestAnimationFrame(this.update.bind(this));
	}

	async loadObstacle(url) {
		// let { model, animations } = await this.context.assetLoader.loadModel(url);

		return { model, animations };
	}

	attachCollider(parentMesh) {
		const halfExtents = new Vec3(0.5, 0.1, 1.2);
		const boxShape = new Box(halfExtents);
		let carCollider = new Body({
			mass: this.settings.carColliderMass,
			material: this.physicsMaterial,
			type: Body.DYNAMIC,
		});
		carCollider.addShape(boxShape);
		carCollider.position.z = parentMesh.position.z;
		carCollider.position.y = parentMesh.position.y + 0.1;

		this.context.world.addBody(carCollider);
		this.collider = carCollider;

		this.setupEventListners(carCollider);
	}

	setupEventListners() {
		this.collider.addEventListener("collide", (event) => {
			const { contact } = event;

			if (contact.bi.id === this.context.playerCollider.id) {
				this.audioComponent.play();
				this.healthBus.publish("add-damage", 4);
				console.log("player collided with car");
				return;
			}
		});
	}

	updatePosition(placementPostion) {
		if (!this.collider) return;

		this.collider.position.z = placementPostion.z;
		this.carMesh.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.collider.position.z +=
			(this.modelLength / 2) * this.delta.getDelta() * 1.75;
		this.carMesh.position.z = this.collider.position.z;
		// this.collider.position.y = this.carMesh.position.y + 1;
		this.collider.position.x = this.carMesh.position.x;

		// if (this.mixer) this.mixer.update(this.time.getDelta());
	}

	clone() {
		return new Car(this.context, this.spawnPosition);
	}
}

export { Car };
