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

		this.init();
	}

	init() {
		this.renderGraphics = true;

		this.settingEventBus = new EventBus();
		this.gui = new dat.GUI();
		this.gui.close();

		this.time = new THREE.Clock();
		this.time_physics = new THREE.Clock(); //used for interpolating the physics step

		// adding stats UI
		this.stats = new Stats();
		this.stats.showPanel(0);
		document.body.appendChild(this.stats.dom);

		this._g = new G();
		this.G = this._g.getG();

		this.physicsManager = new PhysicsManager(this);

		this.initGameState();
		this.initScoreSystem();
		this.initHealthSystem();
		this.initGameScene();
		this.initLevels();
		this.initPlayerInstance();

		this.cannonDebugger = new CannonDebugger(this.gameWorld.scene, this.world);

		this.uiManager = new UIManager(this);
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

	initLevels() {
		this.levelZero = new LevelZero(this);
		this.levelZero.activeLevel = true;

		this.currentLevel = this.levelZero;
	}

	initPlayerInstance() {
		this.playerInstance = new Player(this);
	}

	addClassSettings() {
		let classSettings = this.gui.addFolder("GLOBAL SETTINGS");
		classSettings.open();
		classSettings
			.add(this.globalSettings, "renderCannonDebug")
			.onChange((value) => {
				this.globalSettings.renderCannonDebug = value;
			});
	}

	animate() {
		this.stats.begin();

		requestAnimationFrame(this.animate.bind(this));
		if (!this.renderGraphics) return;

		this.world.step(1 / 120, this.time_physics.getDelta());

		if (this.globalSettings.renderCannonDebug) {
			this.cannonDebugger.update();
		}

		requestAnimationFrame(this.gameWorld.update.bind(this.gameWorld));
		this.currentLevel.update();
		requestAnimationFrame(this.playerInstance.update.bind(this.playerInstance));

		// console.log(this.playerInstance);
		if (this.playerBB && this.busBB && this.playerInstance) {
			// console.log(this.__PM__.matrixWorld);
			// this.__PM__.updateWorldMatrix();
			this.playerBB
				.copy(this.__PM__.geometry.boundingBox)
				.applyMatrix4(this.__PM__.matrixWorld);
			// console.log(this.playerBB);

			this.busBB
				.copy(this.__BM__.geometry.boundingBox)
				.applyMatrix4(this.__BM__.matrixWorld);

			this.testForCollision();
		}

		this.stats.end();

		// console.table(this.gameWorld.renderer.info);
	}

	testForCollision() {
		if (this.playerBB.intersectsBox(this.busBB)) {
			console.log("player is ");
		}
	}
}

let gameInstance = new Game();
requestAnimationFrame(gameInstance.animate.bind(gameInstance));

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
			console.log(this.logoModel);
		});
	}

	animate() {
		this.tf += 0.1;
		requestAnimationFrame(this.animate.bind(this));
		console.log("hh");
		this.controls.update();
		this.renderer.render(this.scene, this.camera);

		if (this.logoModel) {
			this.logoModel.rotation.y = 0.25 * Math.sin(0.25 * this.tf);
			this.logoModel.rotation.x = 0.25 * Math.sin(0.25 * this.tf);
		}
	}
}

// let berlinRunnerLogo = new BerlinRunnerTextLogo();
// requestAnimationFrame(berlinRunnerLogo.animate.bind(berlinRunnerLogo));
