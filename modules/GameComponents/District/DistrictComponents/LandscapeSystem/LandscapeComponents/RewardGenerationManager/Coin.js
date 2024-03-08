class Coin {
	constructor(context, coinPos) {
		this.context = context
		this.coinPos = coinPos

		this.init()
		this.update()
		return this.coinMesh
	}

	init() {
		this.createCoinMesh()
		this.initCoinAABB()
		this.testForCollision()
	}

	createCoinMesh() {
		let coinGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16)
		let coinMaterial = new THREE.MeshStandardMaterial({
			color: new THREE.Color("yellow"),
			metalness: 0.5,
			roughness: 0.25,
		})

		this.coinMesh = new THREE.Mesh(coinGeo, coinMaterial)
		this.coinMesh.castShadow = true
		this.coinMesh.rotation.x = Math.PI / 2 // Simplified conversion to radians
		this.coinMesh.position.set(0, 0, this.coinPos)

		return this.coinMesh
	}

	initCoinAABB() {
		this.coinAABB = new THREE.Box3().setFromObject(this.coinMesh)
		const box = new THREE.Box3Helper(this.coinAABB, 0xff0000)
		this.context.gameWorld.scene.add(box)
	}

	updateCoinRotation() {
		// Define the initial rotation increment for the first coin
		let initialRotationIncrement = 0.05
		// Define the decrement amount for each subsequent coin's rotation increment

		// Apply the rotation increment to the current coin
		this.coinMesh.rotation.z += initialRotationIncrement
	}

	update() {
		requestAnimationFrame(this.update.bind(this))

		this.updateCoinRotation()

		if (this.coinAABB && this.context.playerBB) {
			this.coinAABB
				.copy(this.coinMesh.geometry.boundingBox)
				.applyMatrix4(this.coinMesh.matrixWorld)
		}
	}

	testForCollision() {
		if (!this.context.gameStateManager.currentState === "in_play") return

		if (
			this.coinAABB &&
			this.context.playerBB &&
			this.context.playerBB.intersectsBox(this.coinAABB)
		) {
			console.log("intersection")
			this.context.scoreEventBus.publish("add-score", 1)
			gsap.to(this.coinMesh.position, {
				x: 15,
				y: 15,
				z: -30,
				duration: 2,
				onComplete: () => {
					gsap.to(this.coinMesh.position, {
						x: this.coinPos.x,
						y: this.coinPos.y,
						z: this.coinPos.z,
						duration: 0.4,
					})
				},
			})
		}

		requestAnimationFrame(this.testForCollision.bind(this))
	}
}

export { Coin }
