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

		this.temp_animations = [
			"running",
			"falling",
			"dying, =(",
			"idle",
			"jumping",
			"sliding",
		];

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

		document.getElementById("player-is-jumping").innerText =
			this.G.PLAYER_JUMPING;

		if (this.gameWorld.scene.getObjectByName("Water")) {
			let childPosition = new THREE.Vector3();
			this.gameWorld.scene
				.getObjectByName("Water")
				.getWorldPosition(childPosition);

			console.log(childPosition.z);

			document.getElementById("dist-to-river").innerText = Math.round(
				this.__PM__.position.distanceTo(childPosition)
			);

			if (
				childPosition.z < 0 &&
				this.__PM__.position.distanceTo(childPosition) < 3 &&
				this.__PM__.position.distanceTo(childPosition) > 2
			) {
				if (!this.G.PLAYER_JUMPING) console.log("not jumping");
				document.getElementById("dist-to-river").style.color = "red";
			} else {
				document.getElementById("dist-to-river").style.color = "greenyellow";
			}
		}

		if (this.gameWorld.scene.getObjectByName("TrainStation")) {
			let childPosition = new THREE.Vector3();
			this.gameWorld.scene
				.getObjectByName("TrainStation")
				.getWorldPosition(childPosition);

			document.getElementById("dist-to-bridge").innerText = Math.round(
				this.__PM__.position.distanceTo(childPosition)
			);
		}

		if (this.gameWorld.scene.getObjectByName("bus-left")) {
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

		this.stats.end();

		// console.table(this.gameWorld.renderer.info);
	}
}

let gameInstance = new Game();
requestAnimationFrame(gameInstance.animate.bind(gameInstance));
document.addEventListener("visibilitychange", function () {
	if (document.hidden) {
		// stop the animation
	} else {
		// resume the animation
		requestAnimationFrame(gameInstance.animate.bind(gameInstance));
	}
});

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
