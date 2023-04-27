export default class RiverTutorial {
	constructor(
		context,
		uiElementId = "river-tutorial",
		messageElementId = "river-tutorial-message"
	) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;
		this.stateBus = this.context.gameStateEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init(uiElementId, messageElementId);
	}

	init(uiElementId, messageElementId) {
		this.uiElement = document.getElementById(uiElementId);

		this.messageElement = document.getElementById(this.messageElement);

		if (this.context.G.DEVICE_TYPE === "mobile")
			this.messageElement.innerText = "SWIPE UP";

		this.completed = false;
		this.inRange = false;

		this.distanceToRiver;
		this.childPosition = new THREE.Vector3();

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.movementEventBus.subscribe("player-jumped", () => {
			if (!this.completed) {
				this.uiElement.style.display = "none";
				this.context.G.UPDATE_SPEED_FACTOR = 0.4;
				this.completed = true;
			}
		});

		this.stateBus.subscribe("restart_game", () => {
			this.completed = true;
			this.uiElement.style.display = "none";
		});
	}

	checkRiverDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_RIVER <= 12.5) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkRiverDistance();
	}
}
