import { BaseUIComponent } from './BaseUIComponent.js';
import { AudioManager } from '../../Core/AudioManager/AudioManager.js';

export default class StageUI extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);
    // Initialize AudioManager instance
    this.audioManager = AudioManager.getInstance();

    this.startGameButton = document.getElementById('start-game-button-final');
    this.instructionText = document.getElementById('instruction-text');
    this.context.G.DEVICE_TYPE == 'desktop'
      ? (this.instructionText.innerHTML =
          'LANE: A|D&nbsp; | SLIDE: S&nbsp; | JUMP: SPACE&nbsp; | MUTE : M')
      : (this.instructionText.innerHTML =
          ' LANE : SWIPE LEFT/RIGHT &nbsp; <br/> SLIDE : SWIPE DOWN&nbsp; <br/> JUMP : SWIPE UP&nbsp;');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupEventSubscriptions();
  }

  setupEventListeners() {
    this.startGameButton.addEventListener('click', () => {
      this.hideComponent();
      this.animateCameraToStartingPoint();
      this.context.audioManager.initializeRunningSound(); // Initialize the running sound before unmuting
      this.context.audioManager.toggleMute(); // Assuming audio starts muted, toggle to unmute. All autoPlay sounds (eg RadioPlayer and Running) will start playing
    });
  }

  setupEventSubscriptions() {
    this.stateBus.subscribe('enter_stage', () => {
      this.showComponent();
      this.moveCameraToViewPlayer();
    });
  }

  animateCameraToStartingPoint() {
    gsap.to(this.context.gameWorld.camera.rotation, {
      y: Math.PI,
      duration: 1,
      onComplete: () => {
        this.context.gameWorld.camera.lookAt(new THREE.Vector3(0, 2, 0));
      },
    });
    gsap.to(this.context.gameWorld.camera.position, {
      y: 2,
      z: 3,
      duration: 1.125,

      onComplete: () => {
        this.stateManager.enterPlay();
      },
    });
  }

  moveCameraToViewPlayer() {
    this.context.gameWorld.camera.position.z = -0.5;
    this.context.gameWorld.camera.position.y = 1;
    this.context.gameWorld.camera.lookAt(new THREE.Vector3(0, 1, 0));
  }
}
