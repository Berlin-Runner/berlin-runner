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
		gsap.to(this.sun.material, {
			opacity: 0,
			duration: 2,
			onComplete: () => {
				this.sun.visible = false
			},
		})

		gsap.to(this.sunlight, {
			intensity: 0,
			duration: 2,
			onComplete: () => {
				this.sunlight.visible = false
			},
		})
	}

	dimSun() {
		gsap.to(this.sun.material, {
			opacity: 0.5,
			duration: 2,
			onComplete: () => {
				//this.sun.visible = false
			},
		})

		gsap.to(this.sunlight, {
			intensity: 0.5,
			duration: 2,
			onComplete: () => {
				//this.sunlight.visible = false
			},
		})
	}

	showSun() {
		this.sun.visible = true
		this.sunlight.visible = true

		this.sun.material.opacity = 0
		this.sunlight.intensity = 0

		this.sun.material.transparent = true

		gsap.to(this.sun.material, {
			opacity: 1,
			duration: 2,
		})

		const originalIntensity = 1
		gsap.to(this.sunlight, {
			intensity: originalIntensity,
			duration: 2,
		})
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

	sunRiseAnimation() {
		// 60sec * [n]Minutes
		let morningToMiddayDuration = 60 * 0.5

		const startPos = { x: 0, y: -2, z: -100 }
		const endPos = { x: 0, y: 40, z: -25 }

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
			onComplete: () => {
				this.sunSetAnimation()
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

	sunSetAnimation() {
		// Duration of the sunset animation in seconds
		let middayToEveningDuration = 60 * 2

		// Define the starting and ending positions
		const startPos = { x: 0, y: 40, z: -25 } // Midday position
		const endPos = { x: 0, y: -2, z: -100 } // Evening position

		// Starting and ending colors
		const startColor = new THREE.Color(0xffffff) // White color for midday
		const endColor = new THREE.Color(0xff2200) // Reddish color for evening

		// GSAP animation for position
		gsap.to(startPos, {
			duration: middayToEveningDuration,
			x: endPos.x,
			y: endPos.y,
			z: endPos.z,
			ease: "easeInOut",
			onUpdate: () => {
				// Update the position of the sun and the light
				this.sun.position.set(startPos.x, startPos.y, startPos.z)
				this.sunlight.position.set(startPos.x, startPos.y, startPos.z)
			},
			onComplete: () => {
				this.sunRiseAnimation()
			},
		})

		// GSAP animation for color
		gsap.to(startColor, {
			duration: middayToEveningDuration,
			r: endColor.r,
			g: endColor.g,
			b: endColor.b,
			ease: "easeInOut",
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
