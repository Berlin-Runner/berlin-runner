import { RewardGenerationManagement } from "../RewardGenerationManager/RewardGenerationManager.js";
import { ObstacleGenerationManager } from "../ObstacleGenerationManager/ObstacleGenerationManager.js";
import { FirstAidGenerationManager } from "../FirstAidManager/FirstAidGenerationManager.js";
class LandscapeGenerationManager {
	constructor(context, opts = null) {
		this.context = context;
		this.opts = opts;

		this.scene = this.context.gameWorld.scene;
		this.model = null;

		this.delta = new THREE.Clock();

		this.counter = 0;
		this.modelLength = 37;

		this.settings = {
			renderWireframe: false,
			moveCity: true,
			recycleCityTiles: true,
		};

		this.updateSpeedFactor = 4;

		this.placementPosition = 0;

		this.init();
	}

	init() {
		if (this.opts != null) {
			// console.log("constructing the city using tiles from level");
			this.landscapesArray = this.opts.tiles;
		} else {
			// console.log("NO CITY TILES PASSED");
		}

		this.z = -this.modelLength * this.landscapesArray.length;

		this.delta = new THREE.Clock();

		this.city = new THREE.Object3D();

		this.landscapesArray.forEach((child, index) => {
			child.position.z -= (this.modelLength - 0) * index;

			this.city.add(child);
		});

		let cityCenter = this.modelLength * this.landscapesArray.length * 0.5;

		this.city.position.z = cityCenter - this.modelLength;
		// this.context.playerInstance.position.z = cityCenter;

		this.scene.add(this.city);

		this.rewardManager = new RewardGenerationManagement(this.context);
		this.obstacleManager = new ObstacleGenerationManager(this.context);
		this.firstAidGenerationManager = new FirstAidGenerationManager(
			this.context
		);
	}

	update() {
		setTimeout(() => {
			requestAnimationFrame(this.update.bind(this));
		}, this.updateSpeedFactor * 1000);
		// if (!this.settings.recycleCityTiles) return;

		let currentMesh =
			this.city.children[this.counter % this.landscapesArray.length];
		this.counter++;

		currentMesh.position.z = this.z;

		this.z -= this.modelLength;
	}

	updatePlacements() {
		setTimeout(() => {
			requestAnimationFrame(this.updatePlacements.bind(this));
		}, this.updateSpeedFactor * 1000);

		this.placementPosition -= this.modelLength * 2;

		if (this.counter % 1 === 0) {
			this.rewardManager.placeReward(this.placementPosition);
		}

		if (this.counter % 2 === 0) {
			this.obstacleManager.placeObstacles(this.placementPosition);
		}

		if (this.counter % 3 == 0) {
			this.firstAidGenerationManager.placeKits(this.placementPosition);
		}
	}

	updateCityMeshPoistion() {
		requestAnimationFrame(this.updateCityMeshPoistion.bind(this));

		if (this.city && this.settings.moveCity)
			this.city.position.z +=
				this.modelLength * (1 / this.updateSpeedFactor) * this.delta.getDelta();
	}

	dispose() {
		this.city.visible = false;
	}
}

export { LandscapeGenerationManager };
