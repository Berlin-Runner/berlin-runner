import { UTIL } from "../../../../../../Util/UTIL.js";

import { Bus } from "./Bus/Bus.js";

class ObstacleGenerationManager {
	constructor(context) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.delta = new THREE.Clock();
		this.obstaclePositionX = [-1, 0, 1];

		this.init();
	}

	init() {
		this.obstacleIndex = 0;
		this.totalObstacles = 1;

		this.buses = [];

		let initialSpawnPosition = new THREE.Vector3(100, 100, 100);
		let bus = new Bus(this.context, initialSpawnPosition);

		this.buses.push(bus);
		// for (let index = 0; index < this.totalObstacles; index++) {
		// 	this.buses.push(bus.clone());
		// }
	}

	placeObstacles(zPos) {
		// zPos = zPos * 5;
		let placementPosition = new THREE.Vector3(
			this.obstaclePositionX[UTIL.randomIntFromInterval(0, 2)],
			0,
			zPos
		);

		placementPosition.z += 10;
		let currentBus = this.buses[this.obstacleIndex % this.totalObstacles];
		currentBus.updatePosition(placementPosition);

		this.obstacleIndex++;
	}
}

export { ObstacleGenerationManager };
