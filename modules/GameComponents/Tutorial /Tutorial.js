export default class Tutorial {
	constructor(context) {
		this.context = context;

		this.init();
	}

	init() {
		this.riverTutorial = new RiverTutorial(this.context);
		this.bridgeTutorial = new BridgeTutorial(this.context);
		this.busTutorial = new BusTutorial(this.context);
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		this.riverTutorial.update();
		this.bridgeTutorial.update();
		this.busTutorial.update();
	}
}

class RiverTutorial {
	constructor(context) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.uiElement = document.getElementById("river-tutorial");

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

		if (this.context.G.DISTANCE_TO_RIVER <= 10) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkRiverDistance();
	}
}

class BridgeTutorial {
	constructor(context) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.uiElement = document.getElementById("bridge-tutorial");

		this.completed = false;
		this.inRange = false;

		this.distanceToRiver;
		this.childPosition = new THREE.Vector3();

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.movementEventBus.subscribe("player-slided", () => {
			if (this.inRange) {
				this.uiElement.style.display = "none";
				this.context.G.UPDATE_SPEED_FACTOR = 0.4;
				this.completed = true;
				this.inRange = false;
			}
		});
	}

	checkBridgeDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_BRIDGE <= 7.5) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkBridgeDistance();
	}
}

class BusTutorial {
	constructor(context) {
		this.context = context;
		this.movementEventBus = this.context.playerMovementEventBus;

		this.playerPosition = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.uiElement = document.getElementById("bus-tutorial");

		this.completed = false;
		this.inRange = false;

		this.distanceToRiver;
		this.childPosition = new THREE.Vector3();

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.movementEventBus.subscribe("player-side-moved", () => {
			if (this.inRange) {
				this.uiElement.style.display = "none";
				this.context.G.UPDATE_SPEED_FACTOR = 0.4;
				this.completed = true;
				this.inRange = false;
			}
		});
	}

	checkBusDistance() {
		if (this.completed) return;

		if (this.context.G.DISTANCE_TO_BUS <= 15) {
			this.inRange = true;
			this.uiElement.style.display = "flex";
			this.context.G.UPDATE_SPEED_FACTOR = 0.1;
		}
	}

	update() {
		this.checkBusDistance();
	}
}
