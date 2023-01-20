import { BaseUIComponent } from "./BaseUIComponent.js";

export default class CharacterPicker extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.continueButton = document.getElementById("charachter-continue-button");

		this.init();

		this.setUpComponentEventListners();
		this.setupEventBusSubscriptions();
	}

	init() {
		this.hideComponent();
		this.hideStatic();
	}

	setUpComponentEventListners() {
		this.continueButton.addEventListener("click", () => {
			// document.getElementById("stage-screen").style.display = "flex";
			this.stateManager.enterStage();
			// this.stateManager.showDistrictPicker();
			this.hideComponent();
		});
	}

	setupEventBusSubscriptions() {
		// this.stateBus.subscribe("pick-district", () => {
		// 	this.hideComponent();
		// 	this.hideStatic();
		// });

		this.stateBus.subscribe("pick-character", () => {
			this.showComponent();
			this.showStatic();
		});
	}
}

class CharacterContainer {
	constructor(context, id) {
		this.context = context;
		this.component = document.getElementById(id);
	}
}
