import { Reward } from "../Reward.js"
import { Vec3, Body, Box } from "../../../../../../../../libs/cannon-es.js"

export default class Coffee extends Reward {
	constructor(context, spawnPosition) {
		super(context)
		this.modelLength = this.context.G.TILE_LENGTH
		this.spawnPosition = spawnPosition

		this.delta = new THREE.Clock()

		this.coffeeCup = this.context.coffee
		console.log(this.coffeeCup)
		this.coffeeCup.scale.setScalar(1)
		this.coffeeCup.position.y = 2
		this.coffeeCup.position.copy(spawnPosition)
		this.coffeeCup.children[0].rotateZ(45 * (Math.PI / 180))

		this.context.cityContainer.add(this.coffeeCup)

		this.initAABB()

		requestAnimationFrame(this.update.bind(this))
		this.testForCollision()
	}

	initAABB() {
		// console.log(this.coffeeCup);
		this.__coffeeCupAABB__ = this.coffeeCup.getObjectByName("aabb")
		this.__coffeeCupAABB__.visible = false
		this.__coffeeCupAABB__.scale.y = 0.01
		this.coffeeCupBB = new THREE.Box3()
		this.coffeeCupBB.setFromObject(this.__coffeeCupAABB__)

		const box = new THREE.Box3Helper(this.coffeeCupBB, 0xff0000)
		// this.context.gameWorld.scene.add(box);
	}

	updatePosition(placementPostion) {
		this.coffeeCup.position.copy(placementPostion)
	}

	update() {
		requestAnimationFrame(this.update.bind(this))

		if (this.coffeeCupBB && this.context.playerBB) {
			this.coffeeCupBB
				.copy(this.__coffeeCupAABB__.geometry.boundingBox)
				.applyMatrix4(this.__coffeeCupAABB__.matrixWorld)
		}

		if (this.context.gameStateManager.currentState === "in_play") {
			this.coffeeCup.position.z +=
				this.modelLength *
				this.context.G.UPDATE_SPEED_FACTOR *
				0.09 *
				this.delta.getDelta()
		}

		// this.coffeeCup.rotation.z += 0.005;
		// this.coffeeCup.rotation.x += 0.005;
		this.coffeeCup.rotation.y += 0.005
	}

	testForCollision() {
		if (!this.context.gameStateManager.currentState === "in_play") return

		if (
			this.coffeeCupBB &&
			this.context.playerBB &&
			this.context.playerBB.intersectsBox(this.coffeeCupBB)
		) {
			this.context.scoreEventBus.publish("add-score", 1)
			gsap.to(this.coffeeCup.scale, {
				x: 0.1,
				y: 0.1,
				z: 0.1,
				duration: 0.14,
				onComplete: () => {
					gsap.to(this.coffeeCup.scale, {
						x: 1,
						y: 1,
						z: 1,
						duration: 0.4,
					})
				},
			})
		}

		requestAnimationFrame(this.testForCollision.bind(this))
	}

	clone() {
		return new Coffee(this.context, this.spawnPosition)
	}
}
