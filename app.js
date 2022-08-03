// const { EventBus } = require("./Util/LightEventBus/EventBus");

const textures = {
  sky: new THREE.TextureLoader().load("assets/textures/sky.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  }),
};

class Game {
  constructor() {
    console.log("THIS IS THE GAME");
    this.init();
  }

  init() {
    this.time = new THREE.Clock();

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.G = new G();

    this.gameStateEventBus = new EventBus();
    this.gameStateManager = new GameStateManager(this);

    this.scoreEventBus = new EventBus();
    this.gameScoreManager = new ScoreManager(this);

    this.scoreWorker = new Worker("./Workers/scoreWorker.js");
    this.scoreWorker.postMessage({});
    this.scoreWorker.onmessage = (e) => {
      this.gameScoreManager.update();
    };

    this.playerHealthEventBus = new EventBus();
    this.playerHealthManager = new HealthManager(this);
    this.healthWorker = new Worker("./Workers/healthWorker.js");
    this.healthWorker.postMessage({});
    this.healthWorker.onmessage = (e) => {
      this.playerHealthManager.update();
    };

    this.gameWorld = new World(this);
    this.G.scene = this.gameWorld.scene;
    this.audioManager = new AudioManager(this);
    this.lanscapeManager = new LandscapeGenerationManager(this);
    this.playerInstance = new Player(this);

    this.landscapeWorker = new Worker("./Workers/landscapeWorker.js");

    this.landscapeWorker.postMessage({});

    this.landscapeWorker.onmessage = (e) => {
      this.lanscapeManager.update();
    };

    this.uiManager = new UIManager(this);
  }

  animate() {
    /* 
    setTimeout(() => {
    requestAnimationFrame(this.animate.bind(this));
    }, 1000 / 60);
     */

    requestAnimationFrame(this.animate.bind(this));

    this.stats.begin();

    this.gameWorld.update();
    this.lanscapeManager.updateCityMeshPoistion();
    this.playerInstance.update();

    this.stats.end();
  }
}

let gameInstance = new Game();
gameInstance.animate();
