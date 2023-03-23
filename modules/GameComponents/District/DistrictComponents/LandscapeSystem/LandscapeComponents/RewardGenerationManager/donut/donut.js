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

		this.initAABB();

		requestAnimationFrame(this.update.bind(this));
		this.testForCollision();
	}

	initAABB() {
		console.log(this.donut);
		this.__donutAABB__ = this.donut.getObjectByName("aabb");
		this.__donutAABB__.visible = false;
		this.__donutAABB__.scale.y = 0.01;
		this.donutBB = new THREE.Box3();
		this.donutBB.setFromObject(this.__donutAABB__);

		const box = new THREE.Box3Helper(this.donutBB, 0xff0000);
		this.context.gameWorld.scene.add(box);
	}

	updatePosition(placementPostion) {
		this.donut.position.z = placementPostion.z;
		this.donut.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		if (this.donutBB && this.context.playerBB) {
			this.donutBB
				.copy(this.__donutAABB__.geometry.boundingBox)
				.applyMatrix4(this.__donutAABB__.matrixWorld);
		}

		if (this.context.gameStateManager.currentState === "in_play") {
			this.donut.position.z +=
				(this.modelLength / 2) *
				this.delta.getDelta() *
				this.context.G.UPDATE_SPEED_FACTOR *
				0.25;
		}

		this.donut.rotation.z += 0.005;
	}

	testForCollision() {
		if (!this.context.gameStateManager.currentState === "in_play") return;

		if (
			this.donutBB &&
			this.context.playerBB &&
			this.context.playerBB.intersectsBox(this.donutBB)
		) {
			this.context.scoreEventBus.publish("add-score", 1);
		}

		requestAnimationFrame(this.testForCollision.bind(this));
	}

	clone() {
		return new Donut(this.context, this.spawnPosition);
	}
}
