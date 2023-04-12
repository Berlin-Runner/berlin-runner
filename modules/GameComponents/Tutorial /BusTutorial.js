export default class BusTutorial {
	constructor(context) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;
		this.stateBus = this.context.gameStateEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.uiElement = document.getElementById("bus-tutorial");

		this.messageElement = document.getElementById("bus-tutorial-message");

		if (this.context.G.DEVICE_TYPE === "mobile")
			this.messageElement.innerText = "SWIPE LEFT / RIGHT";

		this.completed = false;
		this.inRange = false;

		this.distanceToRiver;
		this.childPosition = new THREE.Vector3();

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.movementEventBus.subscribe("player-side-moved", () => {
			if (!this.completed) {
				this.uiElement.style.display = "none";
				this.context.G.UPDATE_SPEED_FACTOR = 0.4;
				this.completed = true;
				// this.inRange = false;
			}
		});

		this.stateBus.subscribe("restart_game", () => {
			this.completed = true;
			this.uiElement.style.display = "none";
		});
	}

	checkBusDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_BUS <= 17.5) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkBusDistance();
	}
}
