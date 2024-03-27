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

	addCoin() {
		this.coinsHolder = new THREE.Group()

		// Specify how many coins you want to add
		const numberOfCoins = 5

		for (let i = 0; i < numberOfCoins; i++) {
			let coinMesh = new Coin(this.context, 1 + i * 2, this.coinsHolder)
			this.coinsHolder.add(coinMesh)
		}

		// this.initCoinAABB() // Initialize coin AABB if needed

		this.scene.add(this.coinsHolder)
	}

	getCoin() {
		return this.coinsHolder
	}

	updatePosition(placementPostion) {
		this.coinsHolder.position.x = placementPostion.x
		this.coinsHolder.position.y = placementPostion.y
		this.coinsHolder.position.z = placementPostion.z
	}

	update() {
		requestAnimationFrame(this.update.bind(this))

		// this.updateCoinRotations()

		this.coinsHolder.position.z +=
			this.modelLength *
			this.context.G.UPDATE_SPEED_FACTOR *
			this.delta.getDelta()
	}

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
