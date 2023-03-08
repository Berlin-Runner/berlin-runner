import { PhysicsManager } from "./modules/Core/PhysicsManager/index.js";

import CannonDebugger from "./modules/Core/PhysicsManager/utils/CannonDebugRender.js";

import { Player } from "./modules/GameComponents/Player/Player.js";

import { G } from "./G.js";

import { EventBus } from "./modules/Util/LightEventBus/EventBus.js";
import { GameStateManager } from "./modules/GameComponents/GameStateManager/GameStateManager.js";

import { ScoreManager } from "./modules//GameComponents/ScoreManager/ScoreManager.js";
import { HealthManager } from "./modules//GameComponents/HealthManager/HealthManager.js";
import { World_ } from "./modules//GameComponents/World/World.js";
import { AudioManager } from "./modules/Core/AudioManager/AudioManager.js";
import { LevelZero } from "./modules/GameComponents/Levels/LevelZero/LevelZero.js";
import { UIManager } from "./modules/GameComponents/UIManager/UIManager.js";

// import { GLTFLoader } from "/libs/GLTFLoader.js";

import * as dat from "/libs/dat.gui.module.js";
import DistrictPicker from "./modules/GameComponents/Pickers/DistrictPicker.js";
import AssetLoader from "./modules/Core/AssetLoader/AssetLoader.js";

class Game {
	constructor() {
		this.textures = {
			sky: new THREE.TextureLoader().load(
				"assets/textures/sky.png",
				(texture) => {
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.minFilter = THREE.NearestFilter;
					texture.magFilter = THREE.NearestFilter;
				}
			),
		};

		this.globalSettings = {
			renderCannonDebug: false,
		};

		this.temp_animations = [
			"running",
			"falling",
			"dying, =(",
			"idle",
			"jumping",
			"sliding",
		];

		this.started = false;
		this.assetLoader = new AssetLoader(this);

		this.init();

		this.assetLoader.loadLandscapeTiles();
	}

	async init() {
		this.renderGraphics = true;

		this.settingEventBus = new EventBus();
		this.gui = new dat.GUI();
		this.gui.close();

		this.time = new THREE.Clock();
		this.delta = new THREE.Clock();
		this.time_physics = new THREE.Clock(); //used for interpolating the physics step

		// adding stats UI
		this.stats = new Stats();
		this.stats.showPanel(0);
		document.body.appendChild(this.stats.dom);

		this._g = new G();
		this.G = this._g.getG();
		this.assetLoader
			.init()
			.then(() => {
				this.initGameState();
				this.initScoreSystem();
				this.initHealthSystem();
				this.initGameScene();
				// this.initLevels();
				this.initPlayerInstance();

				this.cannonDebugger = new CannonDebugger(
					this.gameWorld.scene,
					this.world
				);

				this.uiManager = new UIManager(this);
				this.districtPicker = new DistrictPicker(this);

				this.started = true;
			})
			.catch((err) => {
				console.log(err);
			});
		// this.physicsManager = new PhysicsManager(this);
	}

	initGameState() {
		this.gameStateEventBus = new EventBus();
		this.gameStateManager = new GameStateManager(this);
	}

	initScoreSystem() {
		this.scoreEventBus = new EventBus();
		this.gameScoreManager = new ScoreManager(this);

		/*     this.scoreWorker = new Worker("./workers/scoreWorker.js");
    this.scoreWorker.postMessage({});
    this.scoreWorker.onmessage = (e) => {
      this.gameScoreManager.update();
    }; */
	}

	initHealthSystem() {
		this.playerHealthEventBus = new EventBus();
		this.playerHealthManager = new HealthManager(this);
		/*  this.healthWorker = new Worker("./workers/healthWorker.js");
    this.healthWorker.postMessage({});
    this.healthWorker.onmessage = (e) => {
      this.playerHealthManager.update();
    }; */
	}

	initGameScene() {
		this.audioEventBus = new EventBus();
		this.gameWorld = new World_(this);
		this.G.scene = this.gameWorld.scene;
		this.audioManager = new AudioManager(this);
	}

	initPlayerInstance() {}

	addClassSettings() {
		let classSettings = this.gui.addFolder("GLOBAL SETTINGS");
		classSettings.open();
		classSettings
			.add(this.globalSettings, "renderCannonDebug")
			.onChange((value) => {
				this.globalSettings.renderCannonDebug = value;
			});
	}

	checkRiverIntersection() {
		if (
			this.gameStateManager.currentState != "game_over" &&
			this.gameWorld.scene.getObjectByName("Water") &&
			this.playerInstance
		) {
			let childPosition = new THREE.Vector3();
			this.gameWorld.scene
				.getObjectByName("Water")
				.getWorldPosition(childPosition);

			document.getElementById("dist-to-river").innerText = Math.round(
				this.__PM__.position.distanceTo(childPosition)
			);

			if (
				childPosition.z < 0 &&
				this.__PM__.position.distanceTo(childPosition) < 3 &&
				this.__PM__.position.distanceTo(childPosition) > 2
			) {
				if (!this.G.PLAYER_JUMPING) {
					this.gameStateManager.gameOver();
				}
				document.getElementById("dist-to-river").style.color = "red";
			} else {
				document.getElementById("dist-to-river").style.color = "greenyellow";
			}
		}
	}

	checkBridgeIntersection() {
		if (
			this.gameStateManager.currentState != "game_over" &&
			this.gameWorld.scene.getObjectByName("TrainStation") &&
			this.playerInstance
		) {
			let childPosition = new THREE.Vector3();

			this.gameWorld.scene
				.getObjectByName("TrainStation")
				.getWorldPosition(childPosition);

			document.getElementById("dist-to-bridge").innerText = Math.round(
				this.__PM__.position.distanceTo(childPosition)
				// childPosition.distanceTo(this.__PM__.position)
				// this.playerBB.position.distanceTo(childPosition)
			);

			if (
				childPosition.z < 0 &&
				this.__PM__.position.distanceTo(childPosition) < 4 &&
				this.__PM__.position.distanceTo(childPosition) > 3
			) {
				if (this.G.PLAYER_SLIDING) {
					this.gameWorld.scene.getObjectByName(
						"Train_Station001"
					).material.wireframe = true;
					this.gameWorld.scene.getObjectByName(
						"Train_Station001_1"
					).material.wireframe = true;
					this.gameWorld.scene.getObjectByName(
						"Train_Station001_2"
					).material.wireframe = true;
				} else {
				}
				if (!this.G.PLAYER_SLIDING) {
					this.gameStateManager.gameOver();
				}

				document.getElementById("dist-to-river").style.color = "red";
			} else {
				this.gameWorld.scene.getObjectByName(
					"Train_Station001"
				).material.wireframe = false;
				this.gameWorld.scene.getObjectByName(
					"Train_Station001_1"
				).material.wireframe = false;
				this.gameWorld.scene.getObjectByName(
					"Train_Station001_2"
				).material.wireframe = false;
				document.getElementById("dist-to-river").style.color = "greenyellow";
			}
		}
	}

	updateStats() {
		document.getElementById("player-is-jumping").innerText =
			this.G.PLAYER_JUMPING;

		document.getElementById("player-is-sliding").innerText =
			this.G.PLAYER_SLIDING;
		if (
			this.gameWorld.scene.getObjectByName("bus-left") &&
			this.playerInstance
		) {
			let childPosition = new THREE.Vector3();
			this.gameWorld.scene
				.getObjectByName("bus-left")
				.getWorldPosition(childPosition);

			document.getElementById("dist-to-bus").innerText = Math.round(
				this.__PM__.position.distanceTo(childPosition)
			);
		}

		document.getElementById("current-game-state").innerText =
			this.gameStateManager.currentState;
		document.getElementById("active-player-animation").innerText =
			this.temp_animations[this.currentPlayerState];
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		if (this.started) {
			this.stats.begin();

			this.checkRiverIntersection();
			this.checkBridgeIntersection();

			this.updateStats();

			this.gameWorld.update();
			if (this.currentLevel) this.currentLevel.update();
			if (this.playerInstance) this.playerInstance.update();

			this.stats.end();
		}
	}
}

let gameInstance = new Game();
gameInstance.animate();

class BerlinRunnerTextLogo {
	constructor() {
		this.canvas = document.getElementById("game-title");
		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			40
		);

		this.tf = 1;

		this.camera.position.z = 4;

		this.scene = new THREE.Scene();
		// this.scene.background = new THREE.Color("blue");

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		});

		this.renderer.setSize(350, 150);
		this.renderer.setPixelRatio(window.devicePixelRatio * 0.5);

		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.canvas.appendChild(this.renderer.domElement);

		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enabled = false;

		let ambLight = new THREE.AmbientLight("#ddd", 0.75);
		this.scene.add(ambLight);

		let sunLight = new THREE.DirectionalLight("#fff", 1);
		sunLight.position.set(0, 1.5, 1);
		this.scene.add(sunLight);

		this.loadLogo();
	}

	loadLogo() {
		let loader = new THREE.GLTFLoader();
		loader.load("/assets/models/berlin-runner-text.glb", (res) => {
			this.logoModel = res.scene.children[0];
			this.scene.add(this.logoModel);
		});
	}

	animate() {
		this.tf += 0.1;
		requestAnimationFrame(this.animate.bind(this));

		this.controls.update();
		this.renderer.render(this.scene, this.camera);

		if (this.logoModel) {
			this.logoModel.rotation.y = 0.25 * Math.sin(0.25 * this.tf);
			this.logoModel.rotation.x = 0.25 * Math.sin(0.25 * this.tf);
		}
	}
}
