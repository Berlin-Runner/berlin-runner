import { ObstacleGenerationManager } from "./LandscapeComponents/ObstacleGenerationManager/ObstacleGenerationManager.js";
class LandscapeGenerationManager {
	constructor(context, opts = null) {
		this.context = context;
		this.opts = opts;

		this.scene = this.context.gameWorld.scene;
		this.gameState = this.context.gameStateManager;
		this.stateBus = this.context.gameStateEventBus;

		this.settings = {
			renderWireframe: false,
			moveCity: true,
			recycleCityTiles: true,
		};

		this.init();
	}

	init() {
		this.counter = 0;
		this.delta = new THREE.Clock();

		this.model = null;
		this.modelLength = this.context.G.TILE_LENGTH;

		this.updateSpeedFactor = 0.25; //use this to make things move faster

		this.placementPosition = -200;

		this.initCityTiles();

		this.obstacleManager = new ObstacleGenerationManager(this.context);

		this.setupEventSubscriptions();
	}

	initCityTiles() {
		if (this.opts != null) {
			this.landscapesArray = this.opts.tiles;
		} else {
		}

		this.city = new THREE.Group();
		this.cityTiles = new THREE.Group();

		this.landscapesArray.forEach((child, index) => {
			child.position.z -= this.modelLength * index;
			this.cityTiles.add(child);
		});

		this.city.add(this.cityTiles);

		this.z = -this.modelLength * this.landscapesArray.length;

		let cityCenter = this.modelLength * this.landscapesArray.length * 0.5;
		this.cityTiles.position.z = cityCenter - this.modelLength;

		this.cityTiles.traverse((child) => {
			if (child.isMesh) {
				child.material.roughness = 0.8;
				child.material.castShadow = true;
				child.material.recieveShadow = true;
			}
		});

		this.scene.add(this.city);
		this.context.cityContainer = this.city;
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("restart_game", () => {
			this.updateSpeedFactor = 0.25;
			// this.cityTiles.position.z = 240;
		});
	}

	update() {
		setTimeout(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / this.updateSpeedFactor);

		if (this.gameState.currentState == "in_play") {
			let currentMesh =
				this.cityTiles.children[this.counter % this.landscapesArray.length];
			this.counter++;

			currentMesh.position.z = this.z;

			this.z -= this.modelLength;
		}
	}

	updateSpeed() {
		setTimeout(() => {
			requestAnimationFrame(this.updateSpeed.bind(this));
			if (this.gameState.currentState != "in_play") return;
			this.updateSpeedFactor += 0.075;
			this.context.G.UPDATE_SPEED_FACTOR = this.updateSpeedFactor;
			if (this.updateSpeedFactor > 1) return;
		}, 5 * 1000);
	}

	updatePlacements() {
		setTimeout(() => {
			requestAnimationFrame(this.updatePlacements.bind(this));
		}, 20 * 1000);

		if (this.gameState.currentState == "in_play") {
			if (this.counter % 3 === 0) {
				this.obstacleManager.placeObstacles(this.placementPosition);
			}
		}
	}

	updateCityMeshPoistion() {
		requestAnimationFrame(this.updateCityMeshPoistion.bind(this));
		if (
			this.gameState.currentState === "in_play" &&
			this.cityTiles &&
			this.settings.moveCity
		) {
			this.cityTiles.position.z +=
				this.modelLength * this.updateSpeedFactor * this.delta.getDelta();
		}
	}

	dispose() {}
}

export { LandscapeGenerationManager };
