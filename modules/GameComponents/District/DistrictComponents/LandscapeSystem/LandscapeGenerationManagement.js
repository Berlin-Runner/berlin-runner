import { ObstacleGenerationManager } from "./LandscapeComponents/ObstacleGenerationManager/ObstacleGenerationManager.js";
class LandscapeGenerationManager {
	constructor(context, opts = null) {
		this.context = context;
		this.opts = opts;

		this.scene = this.context.gameWorld.scene;
		this.model = null;

		this.gameState = this.context.gameStateManager;
		this.stateBus = this.context.gameStateEventBus;

		this.delta = new THREE.Clock();

		this.counter = 0;
		this.modelLength = this.context.G.TILE_LENGTH;

		this.settings = {
			renderWireframe: false,
			moveCity: true,
			recycleCityTiles: true,
		};

		this.updateSpeedFactor = 3.5; //use this to make things move faster
		this.updateSpeedFactor_ = 1; //use this to make things move faster

		this.placementPosition = -200;

		this.init();
	}

	init() {
		if (this.opts != null) {
			this.landscapesArray = this.opts.tiles;
		} else {
		}

		this.z = -this.modelLength * this.landscapesArray.length;

		this.city = new THREE.Object3D();

		this.landscapesArray.forEach((child, index) => {
			child.position.z -= (this.modelLength - 0) * index;

			this.city.add(child);
		});

		let cityCenter = this.modelLength * this.landscapesArray.length * 0.5;

		this.city.position.z = cityCenter - this.modelLength;

		this.context.cityContainer = this.city;

		this.scene.add(this.city);

		this.obstacleManager = new ObstacleGenerationManager(this.context);

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("restart_game", () => {
			this.updateSpeedFactor_ = 1;
		});
	}

	update() {
		if (this.gameState.currentState == "in_play") {
			let currentMesh =
				this.city.children[this.counter % this.landscapesArray.length];
			this.counter++;

			currentMesh.position.z = this.z;

			this.z -= this.modelLength;
		}

		setTimeout(() => {
			requestAnimationFrame(this.update.bind(this));
		}, this.updateSpeedFactor * 1000);

		setTimeout(() => {
			if (this.gameState.currentState != "in_play") return;
			this.updateSpeedFactor_ += 0.125;
			if (this.updateSpeedFactor_ > 2) return;

			console.log("CURRENT UPDATE SCALE" + this.updateSpeedFactor_);
		}, 20 * 1000);
	}

	updatePlacements() {
		if (this.gameState.currentState == "in_play") {
			if (this.counter % 3 === 0) {
				this.obstacleManager.placeObstacles(this.placementPosition);
			}
		}
		setTimeout(() => {
			requestAnimationFrame(this.updatePlacements.bind(this));
		}, 20 * 1000);
	}

	updateCityMeshPoistion() {
		requestAnimationFrame(this.updateCityMeshPoistion.bind(this));
		if (this.gameState.currentState == "in_play") {
			if (this.city && this.settings.moveCity)
				this.city.position.z +=
					this.modelLength *
					(1 / this.updateSpeedFactor) *
					this.delta.getDelta() *
					this.updateSpeedFactor_;
		}
	}

	dispose() {
		this.city.visible = false;
	}
}

export { LandscapeGenerationManager };
