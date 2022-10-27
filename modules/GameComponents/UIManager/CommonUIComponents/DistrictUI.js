import { BaseUIComponent } from "../BaseUIComponent.js";

class DistrictUI extends BaseUIComponent {
	constructor(id, context, districtIndex) {
		super(id, context, districtIndex);

		this.districtIndex = districtIndex;
		this.enterButton = this.uiComponent.querySelector(".enter-button");

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupEventSubscriptions();
	}

	setupEventListeners() {
		this.enterButton.addEventListener("click", () => {
			this.stateManager.startGame(this.districtIndex);
		});
	}

	setupEventSubscriptions() {}
}

export { DistrictUI };
