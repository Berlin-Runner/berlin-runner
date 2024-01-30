class Sun {
	constructor(world) {
		this.world = world

		this.init()
	}

	init() {
		this.addSunMesh()
		this.addSunLight()
	}

	hideSun() {
		this.sun.visible = false
		this.sunlight.visible = false
	}

	showSun() {
		this.sun.visible = true
		this.sunlight.visible = true
	}

	addSunMesh() {
		let sunGeo = new THREE.SphereGeometry(0.5, 32, 32)
		let sunMat = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			emissive: 0xffffff,
			emissiveIntensity: 1,
			metalness: 0,
			roughness: 0,
			transparent: true,
			opacity: 0.99,
			side: THREE.DoubleSide,
		})
		// add a sphere mesh representing the sun
		this.sun = new THREE.Mesh(sunGeo, sunMat)
		this.sun.position.set(0, -1, -50)
		this.world.scene.add(this.sun)
	}

	addSunLight() {
		this.sunlight = new THREE.DirectionalLight(0xffffff, 1)

		// Set the position of the light to simulate the sun's position
		this.sunlight.position.set(-2, 5, 0)
		this.sunlight.castShadow = true

		// Optional: Configure shadow properties for better quality
		this.sunlight.shadow.mapSize.width = 1024 // Default is 512
		this.sunlight.shadow.mapSize.height = 1024 // Default is 512
		this.sunlight.shadow.camera.near = 0.5 // Default is 0.5
		this.sunlight.shadow.camera.far = 500 // Default is 500

		this.world.scene.add(this.sunlight)
	}

	animateSun() {
		// 60sec * [n]Minutes
		let morningToMiddayDuration = 60 * 0.5

		const startPos = { x: 0, y: -2, z: -100 }
		const endPos = { x: 0, y: 20, z: -15 }

		// Starting and ending colors
		const startColor = new THREE.Color(0xff2200) // Reddish color for morning
		const endColor = new THREE.Color(0xffffff) // White color for midday

		// GSAP animation for position
		gsap.to(startPos, {
			duration: morningToMiddayDuration, // Duration in seconds (5 minutes)
			x: endPos.x,
			y: endPos.y,
			z: endPos.z,
			onUpdate: () => {
				// Update the position of the sun and the light
				this.sun.position.set(startPos.x, startPos.y, startPos.z)
				this.sunlight.position.set(startPos.x, startPos.y, startPos.z)
			},
		})

		// GSAP animation for color
		gsap.to(startColor, {
			duration: morningToMiddayDuration,
			r: endColor.r,
			g: endColor.g,
			b: endColor.b,
			onUpdate: () => {
				// Interpolate the color
				const currentColor = new THREE.Color(
					startColor.r,
					startColor.g,
					startColor.b
				)
				this.sun.material.color = currentColor
				this.sun.material.emissive = currentColor
				this.sunlight.color = currentColor
			},
		})
	}
}

export { Sun }
