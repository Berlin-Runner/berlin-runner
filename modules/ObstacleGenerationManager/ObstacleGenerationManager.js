import { Vec3 } from "../../libs/cannon-es.js";
import { UTIL } from "../Util/UTIL.js";
import { MetalBarrier } from "./MetalBarrier/MetalBarrier.js";

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

		// this.metalBarrier = new MetalBarrier(this.context);

		let initialSpawnPosition = new THREE.Vector3(0, 0, -2000);

		for (let index = 0; index < this.totalObstacles; index++) {
			this.obstacles[index] = new MetalBarrier(
				this.context,
				initialSpawnPosition
			);
		}
	}

	placeObstacles(zPos) {
		let placementPosition = new THREE.Vector3(
			this.obstaclePositionX[UTIL.randomIntFromInterval[(0, 2)]],
			0,
			zPos
		);

		let obstacle = this.obstacles[this.obstacleIndex % this.totalObstacles];
		obstacle.updatePosition(placementPosition);
		this.obstacleIndex++;

		obstacle = obstacle.obstacleMesh;
		// this.scene.add(obstacle);
	}
}

export { ObstacleGenerationManager };
