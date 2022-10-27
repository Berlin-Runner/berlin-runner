import { UTIL } from "../../../../../../Util/UTIL.js";
import { Kermit } from "./Kermit/Kermit.js";
import { MetalBarrier } from "./MetalBarrier/MetalBarrier.js";
import { Ramp } from "./Ramp/Ramp.js";

class ObstacleGenerationManager {
	constructor(context) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.delta = new THREE.Clock();
		this.obstaclePositionX = [-2.5, 0, 2.5];

		this.init();
	}

	init() {
		this.obstacleIndex = 0;
		this.totalObstacles = 20;
		this.obstacles = [];
		this.ramps = [];
		this.kermits = [];

		// this.metalBarrier = new MetalBarrier(this.context);

		let initialSpawnPosition = new THREE.Vector3(0, 0, -2000);
		let ramp = new Ramp(this.context, initialSpawnPosition);
		let kermit = new Kermit(this.context, initialSpawnPosition);

		for (let index = 0; index < this.totalObstacles; index++) {
			this.obstacles[index] = new MetalBarrier(
				this.context,
				initialSpawnPosition
			);

			this.ramps[index] = ramp.clone();

			this.kermits.push(kermit.clone());
		}
	}

	placeObstacles(zPos) {
		let placementPosition = new THREE.Vector3(
			this.obstaclePositionX[UTIL.randomIntFromInterval(0, 2)],
			0,
			zPos
		);

		let obstacle = this.obstacles[this.obstacleIndex % this.totalObstacles];
		obstacle.updatePosition(placementPosition);

		obstacle = obstacle.obstacleMesh;

		placementPosition.z += 30;
		let slantRamp = this.ramps[this.obstacleIndex % this.totalObstacles];
		slantRamp.updatePosition(placementPosition);

		placementPosition.z += 38;
		let kermitBoy = this.kermits[this.obstacleIndex % this.totalObstacles];
		kermitBoy.updatePosition(placementPosition);

		this.obstacleIndex++;
	}
}

export { ObstacleGenerationManager };
