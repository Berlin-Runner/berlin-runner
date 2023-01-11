import { BaseUIComponent } from "./BaseUIComponent.js";

export default class CharacterPicker extends BaseUIComponent {
	constructor(id, context) {
		super(id, context);

		this.continueButton = document.getElementById("charachter-continue-button");

		this.setUpComponentEventListners();
		this.setupEventBusSubscriptions();
	}

	setUpComponentEventListners() {
		this.continueButton.addEventListener("click", () => {
			this.stateManager.showDistrictPicker();
		});
	}

	setupEventBusSubscriptions() {
		this.stateBus.subscribe("pick-district", () => {
			this.hideComponent();
			this.hideStatic();
		});

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
