import { LandscapeTile } from "../../GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeTile.js"
import { UTIL } from "../../Util/UTIL.js"

const assetConfig = {
	landscapeTiles: {
		tileOne: "assets/models/tiles/tiles.1.2.glb",
		tileTwo: "assets/models/tiles/tiles.2.3.glb",
		tileThree: "assets/models/tiles/tiles.3.2.glb",
		tileFour: "assets/models/tiles/tiles.4.glb",
		tileFive: "assets/models/tiles/tiles.5.glb",
		tileSix: "assets/models/tiles/tiles.6.3.glb",
		tileSeven: "assets/models/tiles/tiles.7.glb",
		tileEight: "assets/models/tiles/tiles.8.glb",
		tileNine: "assets/models/tiles/tiles.9.glb",
	},

	characterModels: {
		ben: "/assets/models/zen-ben-v2.glb",
		katy: "/assets/models/katy.glb",
		captain: "/assets/models/captain-bubble.glb",
		coach: "/assets/models/coach_aabb.glb",
		bouncer: "/assets/models/bouncer.glb",
	},

	otherModels: {
		coffee: "/assets/models/coffee_cup_v3.glb",
		bus: "/assets/models/buses_.glb",
	},
}

export default class AssetLoader {
	constructor(context) {
		this.context = context
	}

	async init() {
		this.error = false

		this.setupLoadingManager()
		this.setupGLTFLoader()

		this.loadingPage = document.getElementById("loading-progress-page")
		this.instructionsContainer = document.querySelector(".instructions")
		this.loadBarElement = document.querySelector(".loading-bar")
		this.percentSpan = document.querySelector(".percentage")

		return new Promise(async (resolve, reject) => {
			this.context.landscapeTiles = await this.loadAssets(
				assetConfig.landscapeTiles,
				this.loadLandscapeTile.bind(this)
			)

			this.context.characterModels = await this.loadAssets(
				assetConfig.characterModels,
				this.loadModel.bind(this)
			)

			await this.loadCoffee()
			await this.loadBusModel()

			if (this.error) {
				reject("there's some problem")
			} else resolve("everything is good")
		})
	}

	setupLoadingManager() {
		this.manager = new THREE.LoadingManager()
		this.loadingText = document.getElementById("loading-text")
		this.lastLoadedAMount = 0
		this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
			var message =
				//"Started loading file: " +
				//url +
				//+".\n"
				"Loaded " +
				itemsLoaded +
				" of " +
				itemsTotal +
				" files."
			// console.log(message)
			this.loadingText.innerHTML = message
		}

		this.manager.onLoad = () => {
			var message = "Loading complete!"
			// console.log(message)
			this.loadingText.innerHTML = message
		}

		this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
			var message =
				//"Loading file: " +
				//url +
				//+".\n"
				"Loaded " +
				itemsLoaded +
				" of " +
				itemsTotal +
				" files."
			// console.log(message)
			this.loadingText.innerHTML = message
			this.progressRatio = itemsLoaded / itemsTotal
			this.progress = this.progressRatio * 100

			if (this.progress > this.lastLoadedAMount) {
				this.percentSpan.innerHTML = `${Math.round(this.progressRatio * 100)}`
				this.loadBarElement.style.transform = `scaleX(${this.progressRatio})`
				this.lastLoadedAMount = this.progress
			}
		}

		this.manager.onError = (url) => {
			this.error = url
		}

		this.context.globalLoadingManager = this.manager
	}

	setupGLTFLoader() {
		this.loader = new THREE.GLTFLoader(this.manager)
	}

	loadModel(url) {
		return new Promise((resolve, reject) => {
			this.loader.load(
				url,
				(gltf) => {
					let result = { model: gltf.scene, animations: gltf.animations }
					resolve(result)
				},
				(progress) => {},
				(err) => {
					reject(err)
				}
			)
		})
	}

	loadLandscapeTile = async (url) => {
		try {
			const tile = await new LandscapeTile(this.context, url)
			return tile
		} catch (error) {
			console.error(`Error loading LandscapeTile from ${url}:`, error)
			throw error
		}
	}

	loadCharacterModel = async (url) => {
		try {
			const { model, animations } = await this.loadModel(url)
			return { model, animations }
		} catch (error) {
			console.error(`Error loading character model from ${url}:`, error)
			throw error
		}
	}

	async loadAssets(assetURLs, loaderFunc) {
		const loadedAssets = {}
		for (const key in assetURLs) {
			loadedAssets[key] = await loaderFunc(assetURLs[key])
		}
		return loadedAssets
	}

	async loadCoffee() {
		let { model } = await this.loadModel(assetConfig.otherModels.coffee)
		this.context.coffee = model
	}

	async loadBusModel() {
		let { model } = await this.loadModel(assetConfig.otherModels.bus)
		this.context.busModel = model
	}
}
