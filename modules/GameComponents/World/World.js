class World_ {
	constructor(context) {
		this.context = context
		this.init()
		this.resize()
		this.setupResize()
		this.addClassSettings()
	}

	init() {
		this.initCamera()

		this.initScene()

		this.initRenderer()

		this.initControls()

		this.initLights()
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			0.1,
			100000.0
		)
	}

	initScene() {
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color("#87CEFA")
	}

	initRenderer() {
		this.canvas = document.getElementById("webgl")

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		})

		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio * 0.5)

		this.renderer.outputEncoding = THREE.sRGBEncoding
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		this.renderer.physicallyCorrectLights = true

		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

		this.canvas.appendChild(this.renderer.domElement)
	}

	initControls() {
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		)
		this.controls.enabled = false
	}

	initLights() {
		let ambLight = new THREE.AmbientLight("#ffffff", 1)
		this.scene.add(ambLight)
		this.addSun()
	}

	addSun() {
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
		this.scene.add(this.sun)

		this.sunlight = new THREE.DirectionalLight(0xffffff, 1)

		// Set the position of the light to simulate the sun's position
		this.sunlight.position.set(-2, 5, 0)
		this.sunlight.castShadow = true

		// Optional: Configure shadow properties for better quality
		this.sunlight.shadow.mapSize.width = 1024 // Default is 512
		this.sunlight.shadow.mapSize.height = 1024 // Default is 512
		this.sunlight.shadow.camera.near = 0.5 // Default is 0.5
		this.sunlight.shadow.camera.far = 500 // Default is 500

		this.scene.add(this.sunlight)

		this.animateSun()
	}

	animateSun() {
		// 60sec * [n]Minutes
		let morningToMiddayDuration = 60 * 2

		const startPos = { x: 0, y: -2, z: -100 }
		const endPos = { x: 0, y: 20, z: -15 }

		// Starting and ending colors
		const startColor = new THREE.Color(0xff4500) // Reddish color for morning
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

	setupResize() {
		window.addEventListener("resize", this.resize.bind(this))
	}

	resize() {
		let w = window.innerWidth
		let h = window.innerHeight

		this.renderer.setSize(w, h)
		this.camera.aspect = w / h
		this.camera.updateProjectionMatrix()
	}

	update() {
		if (this.controls.enabled) this.controls.update()
		this.renderer.render(this.scene, this.camera)
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("WORLD SETTINGS")

		this.localSettings
			.add(this.controls, "enabled")
			.onChange((value) => {
				this.controls.enabled = value
				this.context.settingEventBus.publish("go-hands-free", value)
			})
			.name("hands-free")

		this.localSettings.open()
	}
}

export { World_ }
