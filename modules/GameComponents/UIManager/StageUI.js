import { BaseUIComponent } from "./BaseUIComponent.js";

export default class StageUI extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.startGameButton = document.getElementById("start-game-button-final");
		this.instructionText = document.getElementById("instruction-text");
		this.context.G.DEVICE_TYPE == "desktop"
			? (this.instructionText.innerHTML =
					"LANE: A|D&nbsp; | SLIDE: S&nbsp; | JUMP: SPACE&nbsp; | MUTE : M")
			: (this.instructionText.innerHTML =
					" LANE : SWIPE LEFT/RIGHT &nbsp; <br/> SLIDE : SWIPE DOWN&nbsp; <br/> JUMP : SWIPE UP&nbsp;");

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupEventSubscriptions();
	}

	setupEventListeners() {
		this.startGameButton.addEventListener("click", () => {
			this.hideComponent();

			this.animateCameraToStartingPoint();
		});
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("enter_stage", () => {
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
