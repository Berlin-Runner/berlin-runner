import { BaseUIComponent } from "../BaseUIComponent.js";

class District extends BaseUIComponent {
	constructor(id, context, districtIndex) {
		super(id, context, districtIndex);

		this.districtIndex = districtIndex;
		this.enterButton = this.uiComponent.querySelector(".enter-button");
		console.log(this.enterButton);

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupEventSubscriptions();
	}

	setupEventListeners() {
		console.log("setting up events");
		this.enterButton.addEventListener("click", () => {
			console.log(`Opening district #${this.districtIndex}`);
			this.stateManager.startGame(this.districtIndex);
		});
	}

	setupEventSubscriptions() {}
}

export { District };
