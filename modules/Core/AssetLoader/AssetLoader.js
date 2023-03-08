import { LandscapeTile } from "../../GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeTile.js";
import { UTIL } from "../../Util/UTIL.js";
export default class AssetLoader {
	constructor(context) {
		this.context = context;

		this.error = false;

		this.setupLoadingManager();
		this.setupGLTFLoader();

		this.loadingPage = document.getElementById("loading-progress-page");
		this.instructionsContainer = document.querySelector(".instructions");
		this.loadBarElement = document.querySelector(".loading-bar");
		this.percentSpan = document.querySelector(".percentage");
		console.log(this.loadingPage.style.bac);
	}

	async init() {
		return new Promise(async (resolve, reject) => {
			await this.loadLandscapeTiles();
			await this.loadCharacterModels();
			await this.loadObstacleModels();
			await this.loadRewardModels();

			if (this.error) {
				reject("there's some problem");
			} else resolve("everything is good");
		});
	}

	setupLoadingManager() {
		this.manager = new THREE.LoadingManager();
		this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
			// console.log(
			// 	"Started loading file: " +
			// 		url +
			// 		".\nLoaded " +
			// 		itemsLoaded +
			// 		" of " +
			// 		itemsTotal +
			// 		" files."
			// );
		};

		this.manager.onLoad = () => {
			console.log("Loading complete!");
			this.loadingPage.style.display = "none";
		};

		this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
			// console.log(
			// 	"Loading file: " +
			// 		url +
			// 		".\nLoaded " +
			// 		itemsLoaded +
			// 		" of " +
			// 		itemsTotal +
			// 		" files."
			// );

			// this.loadingPage.style.backgroundColor = `rgba(255 , 0 , 0 , ${
			// 	1 - itemsLoaded / itemsTotal
			// })`;

			this.progressRatio = itemsLoaded / itemsTotal;
			this.percentSpan.innerHTML = Math.round(this.progressRatio * 100);
			this.loadBarElement.style.transform = `scaleX(${this.progressRatio})`;

			console.log(itemsLoaded / itemsTotal);
		};

		this.manager.onError = (url) => {
			console.log("There was an error loading " + url);
		};

		this.context.globalLoadingManager = this.manager;
	}

	setupGLTFLoader() {
		this.loader = new THREE.GLTFLoader(this.manager);
	}

	loadModel(url) {
		return new Promise((resolve, reject) => {
			this.loader.load(
				url,
				(gltf) => {
					let result = { model: gltf.scene, animations: gltf.animations };
					resolve(result);
				},
				(progress) => {
					//   console.log(progress);
				},
				(err) => {
					reject(err);
				}
			);
		});
	}

	async loadLandscapeTiles() {
		try {
			this.tileOne = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.1.2.glb"
			);
			this.context.tileOne = this.tileOne;
			this.tileTwo = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.2.3.glb"
			);
			this.context.tileTwo = this.tileTwo;
			this.tileThree = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.3.2.glb"
			);
			this.context.tileThree = this.tileThree;
			this.tileFour = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.4.glb"
			);
			this.context.tileFour = this.tileFour;
			this.tileFive = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.5.glb"
			);
			this.context.tileFive = this.tileFive;
			this.tileSix = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.6.3.glb"
			);
			this.context.tileSix = this.tileSix;
			this.tileSeven = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.7.glb"
			);
			this.context.tileSeven = this.tileSeven;

			this.tileEight = await new LandscapeTile(
				this.context,
				"assets/models/tiles/tiles.8.glb"
			);
			this.context.tileEight = this.tileEight;

			console.log("console.log)");
		} catch (error) {
			console.log(error);
		}
	}

	async loadBenModel() {
		let { model, animations } = await this.loadModel(
			"/assets/models/zen-ben-v2.glb"
		);

		return { model, animations };
	}

	async loadLadyModel() {
		let { model, animations } = await this.loadModel("/assets/models/kati.glb");

		return { model, animations };
	}

	async loadCoachModel() {
		let { model, animations } = await this.loadModel(
			"/assets/models/coach_aabb.glb"
		);

		return { model, animations };
	}

	async loadCharacterModels() {
		this.context.ben = await this.loadBenModel();
		this.context.katy = await this.loadLadyModel();
		this.context.coach = await this.loadCoachModel();
	}

	loadObstacleModels() {}

	loadRewardModels() {}
}
