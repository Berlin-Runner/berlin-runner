import { Obstacle } from "../Obstacle.js";

export default class Stage extends Obstacle {
	constructor(context) {
		super(context);
		this.spawnPosition = new THREE.Vector3(0, 0, 0);
		this.stateManager = this.context.gameStateManager;
		this.stateBus = this.context.gameStateEventBus;

		this.init();
	}

	init() {
		this.scene = this.context.gameWorld.scene;

		this.modelUrl =
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/Stage/Model/starting-stage.glb";

		this.loadStage();

		this.setupEventSubscriber();
	}

	async loadStage() {
		let model = this.initObstacle(this.modelUrl);

		model.then((res) => {
			this.stageMesh = res.model;
			this.stageMesh.position.copy(this.spawnPosition);
			this.context.startingStage = this.stageMesh;
			this.scene.add(this.stageMesh);
		});
	}

	setupEventSubscriber() {
		this.stateBus.subscribe("", () => {});
	}

	setupEventListners() {}

	clone() {
		return new Bus(this.context, this.spawnPosition);
	}
}
