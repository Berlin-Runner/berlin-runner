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

		this.tilesToRecycle = [];

		this.init();
	}

	shuffleArray(array) {
		//Fisher-Yates shuffle algorithm
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	init() {
		this.counter = 0;
		this.delta = new THREE.Clock();

		this.lastRewardPlacementTime = 0;
		this.rewardPlacementInterval = 3000; // 3000 ms or 3 seconds

		this.lastTileUpdateTime = 0;
		this.tileUpdateTimeInterval = 100;

		this.modelLength = this.context.G.TILE_LENGTH;

		this.updateSpeedFactor = this.settings.initialSpeedFactor; //use this to make things move faster
		this.context.G.UPDATE_SPEED_FACTOR = this.updateSpeedFactor;

		this.placementPosition = -225;

		this.initCityTiles(this.opts.tiles);
		this.setupEventSubscriptions();

		this.obstacleManager = new ObstacleGenerationManager(this.context);
		this.rewardManager = new RewardGenerationManagement(this.context);
	}

	initCityTiles() {
		this.landscapesArray = this.shuffleArray(this.opts?.tiles ?? []).concat(
			this.opts?.obstacles ?? []
		);

		this.city = new THREE.Group();
		this.cityTiles = new THREE.Group();

		this.landscapesArray.forEach((child, index) => {
			child.position.z -= this.modelLength * index;
			this.cityTiles.add(child);
		});

		this.city.add(this.cityTiles);

		this.z = -this.modelLength * this.landscapesArray.length;

		this.cityCenter = this.modelLength * this.landscapesArray.length * 0.5;
		this.cityTiles.position.z = this.cityCenter - this.modelLength;

		this.cityTiles.traverse((child) => {
			if (child.isMesh) {
				child.material.roughness = 0.8;
				child.material.castShadow = true;
				child.material.recieveShadow = true;
			}
		});

		this.lastTilePosition = 280;

		this.scene.add(this.city);
		this.context.cityContainer = this.city;

		this.objectWorldPositionHolder = this.lastTileWorldPositionHolder =
			new THREE.Vector3(0, 0, 0);
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("restart_game", () => {
			this.updateSpeedFactor = 0.4;
			this.context.G.UPDATE_SPEED_FACTOR = this.updateSpeedFactor;
		});

		this.context.scoreEventBus.subscribe("increase-speed", () => {
			if (this.gameState.currentState != "in_play") return;
			this.updateSpeedFactor += this.settings.speedFactorIncrement / 2;
			this.context.G.UPDATE_SPEED_FACTOR = this.updateSpeedFactor;
			if (this.updateSpeedFactor > 1) return;
		});
	}

	updateCityTiles() {
		const currentTime = performance.now();
		if (currentTime - this.lastTileUpdateTime >= this.tileUpdateTimeInterval) {
			if (this.gameState.currentState == "in_play") {
				this.cityTiles.children.forEach((child) => {
					child.getWorldPosition(this.objectWorldPositionHolder);
					if (this.objectWorldPositionHolder.z > 50) {
						child.visible = false;
						this.tilesToRecycle.push(child);
						this.cityTiles.remove(child);
					}
				});
			}
			this.lastTileUpdateTime = currentTime;
		}
		if (this.tilesToRecycle.length >= 5) {
			this.recycleCityTile();
		}
	}

	recycleCityTile() {
		let randomIndex = this.randomIntFromInterval(
			0,
			this.tilesToRecycle.length - 1
		);
		let randomTile = this.tilesToRecycle.splice(randomIndex, 1)[0];

		randomTile.position.z = this.z;
		this.z -= this.modelLength;

		randomTile.visible = true;
		this.cityTiles.add(randomTile);
	}

	updateRewardPlacements() {
		const currentTime = performance.now();

		if (
			currentTime - this.lastRewardPlacementTime >=
			this.rewardPlacementInterval
		) {
			if (this.gameState.currentState === "in_play") {
				this.rewardManager.placeReward(-50);
			}

			this.lastRewardPlacementTime = currentTime;
		}
	}

	updateCityMeshPosition() {
		requestAnimationFrame(this.updateCityMeshPosition.bind(this));
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

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.updateCityTiles();
		this.updateCityMeshPosition();
		this.updateRewardPlacements();
	}

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
				// console.log(this.settings.speedFactorIncrement);
			});
	}
}

export { LandscapeGenerationManager };
