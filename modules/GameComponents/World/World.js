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
		this.frame = 4
		this.meshList = []

		this.sun = new Sun(this)
		this.rain = new Rain(this)

		this.weatherStates = ["sunny", "raining", "snowing"]
		this.currentWeather = this.getRandomWeatherState()

		this.applyWeatherState(this.currentWeather)

		gsap.to(
			{},
			{
				duration: 15,
				repeat: -1, // Infinite loop
				onRepeat: () => {
					this.currentWeather = this.getRandomWeatherState()
					this.applyWeatherState(this.currentWeather)
				},
			}
		)
	}

	getRandomWeatherState() {
		const randomIndex = Math.floor(Math.random() * this.weatherStates.length)
		return this.weatherStates[randomIndex]
	}

	applyWeatherState(weather) {
		this.isSunny = false
		this.isRaining = false
		this.isSnowing = false

		switch (weather) {
			case "sunny":
				this.isSunny = true
				this.sun.showSun()
				this.sun.sunRiseAnimation()
				this.rain.hideRain()
				this.hideSnow()
				this.isSnowing = false

				break
			case "raining":
				this.isRaining = true
				this.rain.showRain()
				this.sun.hideSun()
				this.isSnowing = false
				this.hideSnow()
				break
			case "snowing":
				this.sun.hideSun()
				this.rain.hideRain()
				this.isSnowing = true
				this.showSnow()
				break
		}
	}

	hideSnow() {
		for (var i = 0; i < this.meshList.length; i++) {
			this.meshList[i].visible = false
		}
	}

	showSnow() {
		for (var i = 0; i < this.meshList.length; i++) {
			this.meshList[i].visible = true
		}
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
		this.snow = new Snow()

		this.scene.add(this.snow)
		this.meshList.push(this.snow)
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
