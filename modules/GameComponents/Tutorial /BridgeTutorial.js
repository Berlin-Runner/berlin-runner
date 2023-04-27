export default class BridgeTutorial {
	constructor(
		context,
		uiElementId = "bridge-tutorial",
		messageElementId = "bridge-tutorial-message"
	) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;
		this.stateBus = this.context.gameStateEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init(uiElementId, messageElementId);
	}

	init(uiElementId, messageElementId) {
		this.uiElement = document.getElementById(uiElementId);
		this.messageElement = document.getElementById(messageElementId);
		if (this.context.G.DEVICE_TYPE === "mobile")
			this.messageElement.innerText = "SWIPE DOWN";

		this.completed = false;
		this.inRange = false;

		this.distanceToRiver;
		this.childPosition = new THREE.Vector3();

		this.captureGlobalUpdateSpeedFactor = true;

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.movementEventBus.subscribe("player-slided", () => {
			if (!this.completed) {
				this.uiElement.style.display = "none";
				if (!this.captureGlobalUpdateSpeedFactor)
					this.context.G.UPDATE_SPEED_FACTOR = this.globalUpdateSpeedFactor;
				this.completed = true;
			}
		});

		this.stateBus.subscribe("restart_game", () => {
			this.completed = true;
			this.uiElement.style.display = "none";
		});
	}

	checkBridgeDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_BRIDGE <= 12.75) {
			this.inRange = true;
			this.uiElement.style.display = "flex";

			if (this.captureGlobalUpdateSpeedFactor) {
				this.globalUpdateSpeedFactor = this.context.G.UPDATE_SPEED_FACTOR;
				this.captureGlobalUpdateSpeedFactor = false;
			}

			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkBridgeDistance();
	}
}
