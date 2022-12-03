import { Obstacle } from "../Obstacle.js";
import { Vec3, Box, Body } from "../../../../../../../../libs/cannon-es.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";

class Bus extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.spawnPosition = spawnPosition;

		this.init();
	}

	init() {
		this.scene = this.context.gameWorld.scene;
		this.modelLength = this.context.G.TILE_LENGTH;

		this.delta = new THREE.Clock();

		this.audioComponent = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/oooo.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.125,
		});

		this.modelUrl =
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/Bus/Model/buses.glb";

		this.loadCar();
	}

	async loadCar() {
		let model = this.initObstacle(this.modelUrl);
		model.then((res) => {
			this.busMesh = res.model;

			let bus = this.busMesh.children[0];
			// console.log(bus);

			this.context.__BM__ = this.busMesh.children[0];
			let busBB = new THREE.Box3();
			busBB.setFromObject(bus);

			const box = new THREE.Box3Helper(busBB, 0xff0000);
			console.log(box);
			this.context.gameWorld.scene.add(box);

			// console.log("bus BB");
			console.log(this.busMesh);

			this.context.busBB = busBB;

			// this.busMesh.children[0].material.wireframe = true;
			this.scene.add(this.busMesh);
			this.attachCollider(this.busMesh);

			requestAnimationFrame(this.update.bind(this));
		});
	}

	attachCollider() {
		const halfExtents = new Vec3(0, 0, 0);
		const boxShape = new Box(halfExtents);
		let busCollider = new Body({
			material: this.physicsMaterial,
			type: Body.STATIC,
		});
		busCollider.addShape(boxShape);

		this.context.world.addBody(busCollider);
		this.collider = busCollider;
		this.setupEventListners(busCollider);
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
		this.busMesh.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.collider.position.z +=
			(this.modelLength / 2) * this.delta.getDelta() * 0.75;
		this.busMesh.position.z = this.collider.position.z;
		this.collider.position.y = this.busMesh.position.y + 1;
		this.collider.position.x = this.busMesh.position.x + 0.25;
	}

	clone() {
		return new Bus(this.context, this.spawnPosition);
	}
}

export { Bus };
