export default class BridgeTutorial {
	constructor(context) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.uiElement = document.getElementById("bridge-tutorial");
		this.messageElement = document.getElementById("bridge-tutorial-message");

		if (this.context.G.DEVICE_TYPE === "mobile")
			this.messageElement.innerText = "SWIPE DOWN";

		this.completed = false;
		this.inRange = false;

		this.distanceToRiver;
		this.childPosition = new THREE.Vector3();

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.movementEventBus.subscribe("player-slided", () => {
			// if (this.inRange) {
			this.uiElement.style.display = "none";
			this.context.G.UPDATE_SPEED_FACTOR = 0.4;
			this.completed = true;
			// this.inRange = false;
			// }
		});
	}

	checkBridgeDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_BRIDGE <= 8.75) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkBridgeDistance();
	}
}
