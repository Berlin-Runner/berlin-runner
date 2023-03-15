export default class RiverTutorial {
	constructor(context) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.uiElement = document.getElementById("river-tutorial");

		this.messageElement = document.getElementById("river-tutorial-message");

		console.log(this.context.G.DEVICE_TYPE);
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
			if (this.inRange) {
				this.uiElement.style.display = "none";
				this.context.G.UPDATE_SPEED_FACTOR = 0.4;
				this.completed = true;
				this.inRange = false;
			}
		});
	}

	checkRiverDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_RIVER <= 15) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkRiverDistance();
	}
}
