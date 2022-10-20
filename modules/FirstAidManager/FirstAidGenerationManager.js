import { FirstAidKit } from "./FirstAidKit/FirstAidKit.js";
import { UTIL } from "../Util/UTIL.js";

class FirstAidGenerationManager {
	constructor(context) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.delta = new THREE.Clock();
		this.firstAidPlacementPositionX = [-2.5, 0, 2.5];

		this.placementPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.kitIndex = 0;
		this.totalKits = 20;
		this.kits = [];

		let initialSpawnPosition = new THREE.Vector3(0, 0.75, -2000);
		let firstAidKit = new FirstAidKit(this.context, initialSpawnPosition);

		for (let index = 0; index < this.totalKits; index++) {
			this.kits.push(firstAidKit.clone());
		}
	}

	placeKits(zPos) {
		this.placementPosition.x =
			this.firstAidPlacementPositionX[UTIL.randomIntFromInterval(0, 2)];

		this.placementPosition.z = zPos;

		let kit = this.kits[this.kitIndex % this.totalKits];
		kit.updatePosition(this.placementPosition);
		this.kitIndex++;
	}
}

export { FirstAidGenerationManager };
