class HealthManager {
	constructor(context) {
		this.context = context;
		this.healthBus = this.context.playerHealthEventBus;
		this.stateBus = this.context.gameStateEventBus;
		this.stateManager = this.context.gameStateManager;

		this.healthValue = 100;

		this.init();
		requestAnimationFrame(this.update.bind(this));
	}

	init() {
		this.setupEventBusSubscriptions();
	}

	setupEventBusSubscriptions() {
		this.stateBus.subscribe("restart_game", () => {
			this.healthValue = 100;
		});

		this.stateBus.subscribe("back_to_home", () => {
			this.healthValue = 100;
		});

		this.healthBus.subscribe("add-damage", (amount) => {
			this.damageByAmount(amount);
		});

		this.healthBus.subscribe("add-healing", (amount) => {
			console.log("healing by " + amount + " amount");
			this.healByAmount(amount);
		});
	}

	formatHealth(health) {
		return Number(health.toFixed(2));
	}

	getHelth() {
		return this.formatHealth(this.healthValue);
	}

	healByAmount(healAmount) {
		// this.healthValue += healAmount;÷
		this.healthValue += 1;
	}

	damageByAmount(damageAmount) {
		this.healthValue -= damageAmount;
	}

	update() {
		setTimeout(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / 10);

		if (this.stateManager.currentState === "in_play") {
			this.healthBus.publish(
				"update_health",
				this.formatHealth(this.healthValue)
			);
		}
	}
}

export { HealthManager };
