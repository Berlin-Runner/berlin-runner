import { Obstacle } from "../Obstacle.js";
import { Vec3, Box, Body } from "../../../../../../../../libs/cannon-es.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";

class Bus extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.spawnPosition = spawnPosition;
		this.stateManager = this.context.gameStateManager;
		this.stateBus = this.context.gameStateEventBus;

		this.updateSpeedFactor = 7.5;

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
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/Bus/Model/buses_.glb";

		this.loadCar();

		this.setupEventSubscriber();
	}

	async loadCar() {
		let model = this.initObstacle(this.modelUrl);
		model.then((res) => {
			this.busMesh = res.model;
			this.busMesh.position.copy(this.spawnPosition);

			this.context.__BM__ = this.busMesh.getObjectByName("aabb");
			this.context.__BM__.visible = false;
			let busBB = new THREE.Box3();
			this.context.busBB = busBB;
			this.context.busBB.setFromObject(this.context.__BM__);

			const box = new THREE.Box3Helper(this.context.busBB, 0xff0000);

			this.context.cityContainer.add(this.busMesh);

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

	setupEventSubscriber() {
		this.stateBus.subscribe("game_over", () => {
			this.busMesh.position.z = -200;
		});
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
		this.busMesh.position.z = placementPostion.z;
		this.busMesh.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		if (this.stateManager.currentState === "in_play") {
			this.busMesh.position.z +=
				(this.modelLength / 1) *
				this.delta.getDelta() *
				this.context.G.UPDATE_SPEED_FACTOR;

			if (
				this.context.playerBB &&
				this.context.busBB &&
				this.context.playerInstance
			) {
				this.context.busBB
					.copy(this.context.__BM__.geometry.boundingBox)
					.applyMatrix4(this.context.__BM__.matrixWorld);

				this.testForCollision();
			}
		}
	}

	testForCollision() {
		if (!this.stateManager.currentState == "in_play") return;
		if (this.context.playerBB.intersectsBox(this.context.busBB)) {
			this.stateBus.publish("player-crashed");
			this.stateManager.gameOver();
		}
	}

	clone() {
		return new Bus(this.context, this.spawnPosition);
	}
}

export { Bus };
