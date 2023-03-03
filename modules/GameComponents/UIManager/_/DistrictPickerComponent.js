import { BaseUIComponent } from "../BaseUIComponent.js";
import { DistrictUI } from "./DistrictUI.js";
class DistrictPickerComponent extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.scoreHolder = document.getElementById("score-holder");
		this.scoreHolder.style.display = "none";

		this.setUpComponentEventListners();
		this.setupEventBusSubscriptions();

		this.setupDistricts();
	}

	setupDistricts() {
		// this.districtOne = new DistrictUI("district-one", this.context, 0);
	}

	setUpComponentEventListners() {}

	setupEventBusSubscriptions() {
		this.stateBus.subscribe("start_game", () => {
			this.hideComponent();
			// this.hideStatic();
		});

		this.stateBus.subscribe("pick-district", () => {
			this.showComponent();
			this.showStatic();
		});
	}

	startGame() {
		// console.log("start game function");
		// this.stateManager.startGame();
	}

	muteToggle() {
		/*    THIS IS CURRENTLY BEING HANDLED BY THE AUDIO MANAGER,
     PLEASE REFACTOR LATER WITH AN EVENT SYSTEM SO THAT EACH COMPONENT
     HAS ITS OWN EVENT LISTENER AND DO ITS OWN IMPLEMENTATION OF MUTING AND UNMUTING */
	}
}

export { DistrictPickerComponent };
