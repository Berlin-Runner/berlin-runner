import CannonDebugger from './modules/Core/PhysicsManager/utils/CannonDebugRender.js';

import { G } from './G.js';

import { EventBus } from './modules/Util/LightEventBus/EventBus.js';
import { GameStateManager } from './modules/GameComponents/GameStateManager/GameStateManager.js';

import { ScoreManager } from './modules//GameComponents/ScoreManager/ScoreManager.js';
import { HealthManager } from './modules//GameComponents/HealthManager/HealthManager.js';
import { World_ } from './modules//GameComponents/World/World.js';
import { AudioManager } from './modules/Core/AudioManager/AudioManager.js';
import { UIManager } from './modules/GameComponents/UIManager/UIManager.js';

import * as dat from '/libs/dat.gui.module.js';
import AssetLoader from './modules/Core/AssetLoader/AssetLoader.js';
import TutorialManager from './modules/GameComponents/Tutorial/TutorialManager.js';
import CharacterPicker from './modules/GameComponents/Pickers/CharacterPicker.js';

class Game {
  constructor() {
    this.textures = {
      sky: new THREE.TextureLoader().load(
        'assets/textures/sky.png',
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          // texture.minFilter = THREE.NearestFilter;
          // texture.magFilter = THREE.NearestFilter;
        }
      ),
    };

    this.globalSettings = {
      renderCannonDebug: false,
    };

    this.temp_animations = [
      'running',
      'falling',
      'dying, =(',
      'idle',
      'jumping',
      'sliding',
    ];

    this.started = false;
    this.assetLoader = new AssetLoader(this);

    this.init();
  }

  async init() {
    this.riverChildPosition = new THREE.Vector3();
    this.bridgeChildPosition = new THREE.Vector3();
    this.busChildPosition = new THREE.Vector3();

    this.renderGraphics = true;

    this.settingEventBus = new EventBus();
    this.scoreEventBus = new EventBus();

    this.gui = new dat.GUI();
    this.gui.close();
    this.gui.hide();

    this.time = new THREE.Clock();
    this.delta = new THREE.Clock();
    this.time_physics = new THREE.Clock(); //used for interpolating the physics step

    this.playerMovementEventBus = new EventBus();

    this._g = new G();
    this.G = this._g.getG();
    this.assetLoader
      .init()
      .then((res) => {
        this.initGameScene();
        this.initGameState();
        this.initScoreSystem();
        this.initHealthSystem();
        this.uiManager = new UIManager(this);
        this.initPlayerInstance();

        this.cannonDebugger = new CannonDebugger(
          this.gameWorld.scene,
          this.world
        );
        this.loadingPage = document.getElementById('loading-progress-page');

        this.characterPicker = new CharacterPicker(this);
        this.loadingPage.classList.add('ended');

        this.started = true;

        let result = new UAParser().getResult();
        this.G.DEVICE_TYPE =
          result.device.type === undefined ? 'desktop' : 'mobile';

        this.tutorial = new TutorialManager(this);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  initGameState() {
    this.gameStateEventBus = new EventBus();
    this.gameStateManager = new GameStateManager(this);
  }

  initScoreSystem() {
    this.gameScoreManager = new ScoreManager(this);
  }

  initHealthSystem() {
    this.playerHealthEventBus = new EventBus();
    this.playerHealthManager = new HealthManager(this);
  }

  initGameScene() {
    this.audioEventBus = new EventBus();
    this.gameWorld = new World_(this);
    this.G.scene = this.gameWorld.scene;
    this.audioManager = new AudioManager(this);
  }

  initPlayerInstance() {}

  addClassSettings() {
    let classSettings = this.gui.addFolder('GLOBAL SETTINGS');
    classSettings.open();
    classSettings
      .add(this.globalSettings, 'renderCannonDebug')
      .onChange((value) => {
        this.globalSettings.renderCannonDebug = value;
      });
  }

  checkRiverIntersection() {
    if (
      this.gameStateManager.currentState != 'game_over' &&
      this.gameWorld.scene.getObjectByName('Water') &&
      this.playerInstance
    ) {
      this.gameWorld.scene
        .getObjectByName('Water')
        .getWorldPosition(this.riverChildPosition);

      this.G.DISTANCE_TO_RIVER = this.__PM__.position.distanceTo(
        this.riverChildPosition
      );

      if (
        this.riverChildPosition.z < 0 &&
        this.G.DISTANCE_TO_RIVER < 3 &&
        this.G.DISTANCE_TO_RIVER > 2
      ) {
        if (!this.G.PLAYER_JUMPING) {
          this.gameStateManager.gameOver();
        }
      }
    }
  }

  checkBridgeIntersection() {
    if (
      this.gameStateManager.currentState != 'game_over' &&
      this.gameWorld.scene.getObjectByName('TrainStation') &&
      this.playerInstance
    ) {
      this.gameWorld.scene
        .getObjectByName('TrainStation')
        .getWorldPosition(this.bridgeChildPosition);

      this.G.DISTANCE_TO_BRIDGE = this.__PM__.position.distanceTo(
        this.bridgeChildPosition
      );

      if (
        this.bridgeChildPosition.z < 0 &&
        this.G.DISTANCE_TO_BRIDGE < 4 &&
        this.G.DISTANCE_TO_BRIDGE > 3
      ) {
        if (!this.G.PLAYER_SLIDING) {
          this.gameStateManager.gameOver();
        }
      }
    }
  }

  updateStats() {
    if (
      this.gameWorld.scene.getObjectByName('bus-left') &&
      this.playerInstance
    ) {
      this.gameWorld.scene
        .getObjectByName('bus-left')
        .getWorldPosition(this.busChildPosition);

      this.G.DISTANCE_TO_BUS = this.__PM__.position.distanceTo(
        this.busChildPosition
      );
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.started) {
      if (this.tutorial) this.tutorial.update();
      this.checkRiverIntersection();
      this.checkBridgeIntersection();
      this.updateStats();

      this.gameWorld.update();
      if (this.currentLevel) this.currentLevel.update();
      if (this.playerInstance) this.playerInstance.update();
    }
  }
}

let gameInstance = new Game();
gameInstance.animate();
