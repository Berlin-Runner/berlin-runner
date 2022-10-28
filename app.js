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

		this.stats.end();

		// console.table(this.gameWorld.renderer.info);
	}
}

let gameInstance = new Game();
requestAnimationFrame(gameInstance.animate.bind(gameInstance));
