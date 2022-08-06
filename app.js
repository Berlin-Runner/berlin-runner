const textures = {
  sky: new THREE.TextureLoader().load("assets/textures/sky.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  }),
};

class LevelManager {
  static async SetCurrentLevel(context, level) {
    await level.city.awake();
    context.currentLevel = level;
  }

  static ChangeLevel(currentLevel, nextLevel) {
    // DO OTHER OPERATIONS LIKE SETTIG GAME STATE AND STUFF HERE, =)
    currentLevel.end();
  }
}

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

    this.initGameState();
    this.initScoreSystem();
    this.initHealthSystem();
    this.initGameScene();
    this.initPlayerInstance();
    this.initLevels();

    this.uiManager = new UIManager(this);
  }

  initGameScene() {
    this.gameWorld = new World(this);
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

    this.scoreWorker = new Worker("./Workers/scoreWorker.js");
    this.scoreWorker.postMessage({});
    this.scoreWorker.onmessage = (e) => {
      this.gameScoreManager.update();
    };
  }

  initHealthSystem() {
    this.playerHealthEventBus = new EventBus();
    this.playerHealthManager = new HealthManager(this);
    this.healthWorker = new Worker("./Workers/healthWorker.js");
    this.healthWorker.postMessage({});
    this.healthWorker.onmessage = (e) => {
      this.playerHealthManager.update();
    };
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
    requestAnimationFrame(this.animate.bind(this));

    this.stats.begin();

    this.gameWorld.update();
    this.currentLevel.update();

    this.playerInstance.update();

    this.stats.end();
  }
}

let gameInstance = new Game();
gameInstance.animate();
