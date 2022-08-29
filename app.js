import { World } from "./libs/cannon-es.js";

import { PhysicsManager } from "./modules/PhysicsManager/index.js";
import CannonDebugger from "./modules/PhysicsManager/utils/CannonDebugRender.js";

import { Player } from "./modules/Player/Player.js";
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
    console.log("THIS IS THE GAME");

    this.globalSettings = {
      renderCannonDebug: true,
    };

    this.init();
  }

  init() {
    this.renderGraphics = true;

    this.Body = new World();

    this.time = new THREE.Clock();
    this.time_physics = new THREE.Clock();

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
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

  initGameScene() {
    this.gameWorld = new World_(this);
    this.G.scene = this.gameWorld.scene;
    this.audioManager = new AudioManager(this);
  }

  initPlayerInstance() {
    this.playerInstance = new Player(this);
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

  initLevels() {
    this.levelZero = new LevelZero(this);
    this.levelZero.activeLevel = true;

    this.currentLevel = this.levelZero;

    window.addEventListener("keypress", (e) => {
      if (e.code === "KeyN") {
        console.log("NEW LEVEL");
        this.currentLevel.end();
      }
    });

    // this.currentLevel.start();
  }

  animate() {
    setTimeout(() => {
      requestAnimationFrame(this.animate.bind(this));
    }, 1000 / 60);

    if (!this.renderGraphics) return;

    if (true) {
      this.world.step(1 / 30, this.time_physics.getDelta());

      if (this.globalSettings.renderCannonDebug) {
        this.cannonDebugger.update();
      }
    }

    this.stats.begin();

    this.gameWorld.update();
    this.currentLevel.update();

    this.playerInstance.update();
    if (this.playerInstance && this.sphereBody) this.playerInstance.update();

    this.stats.end();
  }
}

let gameInstance = new Game();
gameInstance.animate();
