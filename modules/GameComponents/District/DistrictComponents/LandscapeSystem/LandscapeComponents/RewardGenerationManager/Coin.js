class Coin {
	constructor(context, coinPos) {
		this.context = context
		this.coinPos = coinPos

		this.init()
		return this.coinMesh
	}

	init() {
		this.coinActive = true
		this.debugAABB = false
		this.createCoinMesh()
		this.testForCollision()
		this.update()
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
		this.initCoinAABB()

		return this.coinMesh
	}

	initCoinAABB() {
		this.coinAABB = new THREE.Box3().setFromObject(this.coinMesh)
		const box = new THREE.Box3Helper(this.coinAABB, 0xff0000)
		if (this.debugAABB) this.context.gameWorld.scene.add(box)
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

	/* testForCollision() {
		requestAnimationFrame(this.testForCollision.bind(this))
		if (!this.coinActive) return
		if (this.context.gameStateManager.currentState !== "in_play") return

		if (
			this.coinActive &&
			this.coinAABB &&
			this.context.playerBB &&
			this.context.playerBB.intersectsBox(this.coinAABB)
		) {
			console.log("intersection")
			this.context.scoreEventBus.publish("add-score", 1)
			this.coinActive = false
			gsap.to(this.coinMesh.position, {
				x: 15,
				y: 15,
				z: -30,
				duration: 1,
				onComplete: () => {
					gsap.to(this.coinMesh.position, {
						x: this.coinPos.x,
						y: this.coinPos.y,
						z: this.coinPos.z,
						duration: 0.4,
					})
				},
			})
			setTimeout(() => {
				this.coinActive = true
			}, 1000)
		}
	} */

	testForCollision() {
		requestAnimationFrame(this.testForCollision.bind(this))
		if (
			!this.coinActive ||
			this.context.gameStateManager.currentState !== "in_play"
		)
			return

		if (this.context.playerBB.intersectsBox(this.coinAABB)) {
			console.log("intersection")
			this.context.scoreEventBus.publish("add-score", 1) // Add score
			this.coinActive = false // Deactivate the coin to prevent multiple scores

			// Move the coin out of view and then reset its position after some delay
			gsap.to(this.coinMesh.position, {
				x: 15,
				y: 15,
				z: -30,
				duration: 1,
				onComplete: () => {
					gsap.to(this.coinMesh.position, {
						x: this.coinPos.x,
						y: this.coinPos.y,
						z: this.coinPos.z,
						duration: 0.1,
						onComplete: () => {
							// Reactivate the coin after the animations and a safe buffer time
							setTimeout(() => {
								this.coinActive = true
							}, 400) // Adjust this delay based on your game's requirements
						},
					})
				},
			})
		}
	}
}

export { Coin }
