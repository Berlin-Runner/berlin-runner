import { BaseUIComponent } from "../BaseUIComponent.js";
import { LevelZero } from "../../Levels/LevelZero/LevelZero.js";
class GameIntroComponent extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.camera = this.context.gameWorld.camera;

		this.startGameButton = document.getElementById("start-game-button");
		this.setUpComponentEventListners();
		this.setupEventBusSubscriptions();

		this.init();
	}

	init() {
		this.tiles = [
			this.context.tileOne,
			this.context.tileTwo,
			this.context.tileThree,
			this.context.tileFour,
			this.context.tileFive,
			this.context.tileSix,
			this.context.tileSeven,
		];
	}

	setUpComponentEventListners() {
		this.startGameButton.addEventListener("click", () => {
			this.startGame();
		});

		window.addEventListener("keypress", (e) => {
			if (e.code === "KeyM") {
			}
		});
	}

	setupEventBusSubscriptions() {
		this.stateBus.subscribe("start_game", () => {
			this.hideComponent();
		});

		this.stateBus.subscribe("back_to_home", () => {
			this.showComponent();
		});
	}

	startGame() {
		this.hideComponent();

		gsap.to(this.camera.position, {
			x: 0,
			y: 50,
			z: -110,
			duration: 0,
		});
		gsap.to(this.camera.rotation, { x: 0, y: 0, z: 0, duration: 0.75 });
		this.stateBus.publish("display-chracter-selector");
		this.context.gameStateManager.showCharacterPicker();
		this.initLevels();
		// this.context.characterPicker.select();
	}

	initLevels() {
		this.tiles.forEach((tile, index) => {
			tile.position.z = 0;
			tile.position.x = 0;
			tile.position.y = -0.1;
			tile.scale.setScalar(1);
			tile.rotation.set(0, 0, 0);
		});
		this.context.levelZero = new LevelZero(this.context);
		this.context.levelZero.activeLevel = true;

		this.context.currentLevel = this.context.levelZero;
	}

	muteToggle() {
		/*    THIS IS CURRENTLY BEING HANDLED BY THE AUDIO MANAGER,
     PLEASE REFACTOR LATER WITH AN EVENT SYSTEM SO THAT EACH COMPONENT
     HAS ITS OWN EVENT LISTENER AND DO ITS OWN IMPLEMENTATION OF MUTING AND UNMUTING */
	}
}

export { GameIntroComponent };
