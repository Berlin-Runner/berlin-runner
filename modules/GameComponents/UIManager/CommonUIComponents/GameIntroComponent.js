import { BaseUIComponent } from "../BaseUIComponent.js";
class GameIntroComponent extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.startGameButton = document.getElementById("start-game-button");
		this.setUpComponentEventListners();
		this.setupEventBusSubscriptions();
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

		this.stateManager.showDistrictPicker();
	}

	muteToggle() {
		/*    THIS IS CURRENTLY BEING HANDLED BY THE AUDIO MANAGER,
     PLEASE REFACTOR LATER WITH AN EVENT SYSTEM SO THAT EACH COMPONENT
     HAS ITS OWN EVENT LISTENER AND DO ITS OWN IMPLEMENTATION OF MUTING AND UNMUTING */
	}
}

export { GameIntroComponent };
