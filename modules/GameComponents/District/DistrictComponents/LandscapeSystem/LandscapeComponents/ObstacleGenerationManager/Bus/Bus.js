import { Obstacle } from "../Obstacle.js"
import { Vec3, Box, Body } from "../../../../../../../../libs/cannon-es.js"
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js"
import { UTIL } from "../../../../../../../Util/UTIL.js"

class Bus extends Obstacle {
	constructor(context, spawnPosition) {
		super(context)
		this.spawnPosition = spawnPosition
		this.scene = this.context.gameWorld.scene
		this.stateManager = this.context.gameStateManager
		this.stateBus = this.context.gameStateEventBus

		this.init()
	}

	init() {
		this.modelLength = this.context.G.TILE_LENGTH

		this.delta = new THREE.Clock()

		this.loadCar()

		this.setupEventSubscriber()
	}

	async loadCar() {
		let res = this.context.busModel
		// model.then((res) => {
		this.busMesh = res

		UTIL.bendMesh(this.busMesh, false)

		this.context.__BM__ = this.busMesh.getObjectByName("aabb")
		this.context.__BM__.visible = false
		let busBB = new THREE.Box3()
		this.context.busBB = busBB
		this.context.busBB.setFromObject(this.context.__BM__)

		const box = new THREE.Box3Helper(this.context.busBB, 0xff0000)

		// this.context.cityContainer.add(this.busMesh);
		this.context.landscapeTiles.tileOne.add(this.busMesh)

		requestAnimationFrame(this.update.bind(this))
		// });
	}

	setupEventSubscriber() {
		this.stateBus.subscribe("game_over", () => {})
	}

	setupEventListners() {}

	updatePosition(placementPostion) {
		this.busMesh.position.z = placementPostion.z
		this.busMesh.position.x = placementPostion.x
	}

	update() {
		requestAnimationFrame(this.update.bind(this))

		if (this.stateManager.currentState === "in_play") {
			if (
				this.context.playerBB &&
				this.context.busBB &&
				this.context.playerInstance
			) {
				this.context.busBB
					.copy(this.context.__BM__.geometry.boundingBox)
					.applyMatrix4(this.context.__BM__.matrixWorld)

				this.testForCollision()
			}
		}
	}

	testForCollision() {
		if (!this.stateManager.currentState == "in_play") return
		if (this.context.playerBB.intersectsBox(this.context.busBB)) {
			this.stateBus.publish("player-crashed")
			this.stateManager.gameOver()
		}
	}

	clone() {
		return new Bus(this.context, this.spawnPosition)
	}
}

export { Bus }
