import { Coin } from "./Coin.js"

class CoinGroup {
	constructor(context, spawnPosition) {
		this.context = context
		this.spawnPosition = spawnPosition

		this.scene = this.context.gameWorld.scene
		this.scoreBus = this.context.scoreEventBus

		this.settings = {
			coinColliderMass: 0.0,
		}

		this.init()

		this.addClassSettings()
	}

	init() {
		this.modelLength = this.context.G.TILE_LENGTH

		this.delta = new THREE.Clock()

		this.addCoin()

		this.update()
	}

	/* 	createCoinMesh(positionZ) {
		let coinGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16)
		let coinMaterial = new THREE.MeshStandardMaterial({
			color: new THREE.Color("yellow"),
			metalness: 0.5,
			roughness: 0.25,
		})

		let coinMesh = new THREE.Mesh(coinGeo, coinMaterial)
		coinMesh.castShadow = true
		coinMesh.rotation.x = Math.PI / 2 // Simplified conversion to radians
		coinMesh.position.set(0, 0, positionZ)

		return coinMesh
	} */

	addCoin() {
		this.coinsHolder = new THREE.Group()

		// Specify how many coins you want to add
		const numberOfCoins = 5

		for (let i = 0; i < numberOfCoins; i++) {
			let coinMesh = new Coin(this.context, 1 + i * 2)
			this.coinsHolder.add(coinMesh)
		}

		// this.initCoinAABB() // Initialize coin AABB if needed

		this.scene.add(this.coinsHolder)
	}

	/* initCoinAABB() {
		this.coinAABB = new THREE.Box3().setFromObject(this.coinsHolder.children[2])
		const box = new THREE.Box3Helper(this.coinAABB, 0xff0000)
		// this.context.gameWorld.scene.add(box)
	} */

	getCoin() {
		return this.coinsHolder
	}

	updatePosition(placementPostion) {
		this.coinsHolder.position.x = placementPostion.x
		this.coinsHolder.position.y = placementPostion.y
		this.coinsHolder.position.z = placementPostion.z
	}

	/* 	updateCoinRotations() {
		// Define the initial rotation increment for the first coin
		let initialRotationIncrement = 0.05
		// Define the decrement amount for each subsequent coin's rotation increment
		const decrementPerCoin = 0.005

		this.coinsHolder.children.forEach((coin, index) => {
			// Calculate the rotation increment for the current coin
			let rotationIncrement =
				initialRotationIncrement - decrementPerCoin * index
			// Apply the rotation increment to the current coin
			coin.rotation.z += rotationIncrement
		})
	} */

	update() {
		requestAnimationFrame(this.update.bind(this))

		// this.updateCoinRotations()

		this.coinsHolder.position.z +=
			this.modelLength *
			this.context.G.UPDATE_SPEED_FACTOR *
			this.delta.getDelta()

		/* if (this.coinAABB && this.context.playerBB) {
			this.coinAABB
				.copy(this.coinsHolder.children[2].geometry.boundingBox)
				.applyMatrix4(this.coinsHolder.children[2].matrixWorld)
		} */
	}

	/* testForCollision() {
		if (!this.context.gameStateManager.currentState === "in_play") return

		if (
			this.coinAABB &&
			this.context.playerBB &&
			this.context.playerBB.intersectsBox(this.coinAABB)
		) {
			console.log("intersection")
			this.context.scoreEventBus.publish("add-score", 1)
		}

		requestAnimationFrame(this.testForCollision.bind(this))
	} */

	addClassSettings() {
		/* this.localSettings = this.context.gui.addFolder("COIN SETTINGS");
		this.localSettings
			.add(this.audioComponent, "volume", 0, 1, 0.0124)
			.onChange((value) => {
				this.audioComponent.volume = value;
			}); */
	}

	clone() {
		return new CoinGroup(this.context, this.spawnPosition)
	}
}

export { CoinGroup }
