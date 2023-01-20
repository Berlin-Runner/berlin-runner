import { BaseUIComponent } from "./BaseUIComponent.js";

export default class StageUI extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.displayCharacterPickerButton = document.getElementById(
			"display-character-picker"
		);

		this.startGameButton = document.getElementById("start-game-button-final");

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupEventSubscriptions();
	}

	setupEventListeners() {
		this.displayCharacterPickerButton.addEventListener("click", () => {
			document.getElementById("stage-screen").style.display = "none";
			this.stateManager.showCharacterPicker();
		});

		this.startGameButton.addEventListener("click", () => {
			document.getElementById("stage-screen").style.display = "none";

			this.context.startingStage.position.y = -10;

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
				// ease: "power4.out",
				onComplete: () => {
					this.stateManager.enterPlay();
				},
			});
		});
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("enter_stage", () => {
			document.getElementById("stage-screen").style.display = "flex";
			this.context.gameWorld.camera.position.z = -2;
			this.context.gameWorld.camera.position.y = 1;
			this.context.gameWorld.camera.lookAt(new THREE.Vector3(0, 1, 0));
		});
	}
}
