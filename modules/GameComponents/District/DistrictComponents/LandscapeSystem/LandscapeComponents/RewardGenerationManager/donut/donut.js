import { Reward } from "../Reward.js";
import { Vec3, Body, Box } from "../../../../../../../../libs/cannon-es.js";

export default class Donut extends Reward {
	constructor(context, spawnPosition) {
		super(context);
		this.modelLength = this.context.G.TILE_LENGTH;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();

		this.donut = this.context.donut;
		console.log(this.donut.children);
		this.donut.children[0].scale.setScalar(4);
		this.donut.position.z = -1000;
		this.donut.position.y = 1;
		this.donut.rotateX(-45 * (Math.PI / 180));

		this.context.gameWorld.scene.add(this.donut);

		requestAnimationFrame(this.update.bind(this));
	}

	updatePosition(placementPostion) {
		this.donut.position.z = placementPostion.z;
		this.donut.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		if (this.context.gameStateManager.currentState === "in_play") {
			this.donut.position.z +=
				(this.modelLength / 2) *
				this.delta.getDelta() *
				this.context.G.UPDATE_SPEED_FACTOR *
				0.25;
		}

		this.donut.rotation.z += 0.005;
	}

	clone() {
		return new Donut(this.context, this.spawnPosition);
	}
}
