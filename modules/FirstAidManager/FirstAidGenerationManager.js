import { FirstAidKit } from "./FirstAidKit/FirstAidKit.js";
import { UTIL } from "../Util/UTIL.js";

class FirstAidGenerationManager {
	constructor(context) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.delta = new THREE.Clock();
		this.firstAidPlacementPositionX = [-2.5, 0, 2.5];

		this.init();
	}

	init() {
		this.kitIndex = 0;
		this.totalKits = 20;
		this.kits = [];

		let initialSpawnPosition = new THREE.Vector3(0, 0.75, -2000);

		for (let index = 0; index < this.totalKits; index++) {
			this.kits[index] = new FirstAidKit(this.context, initialSpawnPosition);
		}
	}

	placeKits(zPos) {
		let placementPosition = new THREE.Vector3(
			this.firstAidPlacementPositionX[UTIL.randomIntFromInterval[(0, 2)]],
			0,
			zPos
		);

		let kit = this.kits[this.kitIndex % this.totalKits];
		kit.updatePosition(placementPosition);
		this.kitIndex++;

		// obstacle = obstacle.obstacleMesh;
		// // this.scene.add(obstacle);
	}
}

export { FirstAidGenerationManager };
