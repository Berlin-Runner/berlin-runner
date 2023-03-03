import { BaseUIComponent } from "./BaseUIComponent.js";

export default class StageUI extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.startGameButton = document.getElementById("start-game-button-final");

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
			z: 4,
			duration: 1.125,

			onComplete: () => {
				this.stateManager.enterPlay();
			},
		});
	}

	moveCameraToViewPlayer() {
		this.context.gameWorld.camera.position.z = -2;
		this.context.gameWorld.camera.position.y = 1;
		this.context.gameWorld.camera.lookAt(new THREE.Vector3(0, 1, 0));
	}
}
