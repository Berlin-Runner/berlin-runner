class HealthManager {
	constructor(context) {
		this.context = context;
		this.healthBus = this.context.playerHealthEventBus;
		this.stateBus = this.context.gameStateEventBus;
		this.stateManager = this.context.gameStateManager;

		this.healthValue = 100;

		this.init();
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
	}

	formatHealth(health) {
		return Number(health.toFixed(2));
	}

	getHelth() {
		return this.formatHealth(this.healthValue);
	}

	healByAmount(healAmount) {
		this.healthValue += healAmount;
	}

	damageByAmount(damageAmount) {
		this.healthValue -= damageAmount;
	}

	update() {
		if (this.stateManager.currentState === "in_play") {
			this.healthValue -= 0.01;
			this.healthBus.publish(
				"update_health",
				this.formatHealth(this.healthValue)
			);
		}
	}
}

export { HealthManager };
