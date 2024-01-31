import { Snow } from "./WeatherSystem/Snow.js"
import { Rain } from "./WeatherSystem/Rain.js"
import { Sun } from "./WeatherSystem/Sun.js"
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

		this.initWeatherSystem()
	}

	initWeatherSystem() {
		this.sun = new Sun(this)
		this.isSunny = true
		if (this.isSunny) {
			this.sun.showSun()
			this.sun.sunRiseAnimation()
		} else this.sun.hideSun()

		this.rain = new Rain(this)
		this.isRaining = false
		this.isRaining
			? (this.rain.rainObject.visible = true)
			: (this.rain.rainObject.visible = false)

		this.isSnowing = false

		this.frame = 4
		this.meshList = []
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
		if (this.isSnowing) {
			this.updateSnow()
		} else if (this.isRaining) {
			this.rain.updateRain()
		}
	}

	updateRain() {
		this.globalUniforms.time.value = this.time.getElapsedTime()
	}

	updateSnow() {
		var mesh = new Snow()
		this.scene.add(mesh)
		this.meshList.push(mesh)
		for (var i = 0; i < this.meshList.length; i++) {
			this.meshList[i].update()
		}

		this.frame++
		if (this.frame % 2 == 0) {
			return
		}
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
