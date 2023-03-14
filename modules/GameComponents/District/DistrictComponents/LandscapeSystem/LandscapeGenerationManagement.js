import { ObstacleGenerationManager } from "./LandscapeComponents/ObstacleGenerationManager/ObstacleGenerationManager.js";
import { RewardGenerationManagement } from "./LandscapeComponents/RewardGenerationManager/RewardGenerationManager.js";
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

			initialSpeedFactor: 0.4,
			speedFactorIncrement: 0.075,
		};

		this.init();
	}

	init() {
		this.counter = 0;
		this.delta = new THREE.Clock();

		this.model = null;
		this.modelLength = this.context.G.TILE_LENGTH;

		this.updateSpeedFactor = this.settings.initialSpeedFactor; //use this to make things move faster
		this.context.G.UPDATE_SPEED_FACTOR = this.updateSpeedFactor;

		this.placementPosition = -225;

		this.initCityTiles();

		this.obstacleManager = new ObstacleGenerationManager(this.context);
		this.rewardManager = new RewardGenerationManagement(this.context);

		this.setupEventSubscriptions();

		this.addClassSettings();
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
			this.updateSpeedFactor = 0.4;
			this.context.G.UPDATE_SPEED_FACTOR = this.updateSpeedFactor;
			// this.cityTiles.position.z = 240;
		});
	}

	update() {
		setTimeout(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / this.context.G.UPDATE_SPEED_FACTOR);

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
			this.updateSpeedFactor += this.settings.speedFactorIncrement;
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

	updateRewardPlacements() {
		setTimeout(() => {
			requestAnimationFrame(this.updateRewardPlacements.bind(this));
		}, 5 * 1000);

		if (this.gameState.currentState == "in_play") {
			// if (this.counter % 2 === 0) {
			console.log("COING");
			this.rewardManager.placeReward(-75);
			// }
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
				this.modelLength *
				this.context.G.UPDATE_SPEED_FACTOR *
				this.delta.getDelta();
		}
	}

	dispose() {}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder(
			"LANDSCAPE GENERATION SETTINGS"
		);
		this.localSettings.open();

		this.generationSettings = this.localSettings.addFolder("SPEED SETTINGS");
		this.generationSettings.open();

		this.generationSettings
			.add(this.settings, "initialSpeedFactor", 0, 0.5, 0.01)
			.name("initial speed")
			.onChange((value) => {
				this.initialSpeedFactor = value;
				this.updateSpeedFactor = value;
			});

		this.generationSettings
			.add(this.settings, "speedFactorIncrement", 0, 0.1, 0.0125)
			.name("increment")
			.onChange((value) => {
				console.log(this.settings.speedFactorIncrement);
			});
	}
}

export { LandscapeGenerationManager };
