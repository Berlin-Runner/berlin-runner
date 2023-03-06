import { LandscapeGenerationManager } from "./DistrictComponents/LandscapeSystem/LandscapeGenerationManagement.js";
class District {
	constructor(context, opts) {
		this.context = context;
		this.opts = opts;
		this.name = this.opts.name;
		this.stateBus = this.context.gameStateEventBus;
		this.stateManager = this.context.gameStateManager;

		this.init();
		this.awake();
	}

	init() {
		this.addEventSubscriptionListeners();
	}

	addEventSubscriptionListeners() {
		this.stateBus.subscribe("enter_play", () => {
			this.start();
		});
	}

	awake() {
		this.landscapeManager = new LandscapeGenerationManager(this.context, {
			tiles: this.opts.tiles,
		});
	}

	start() {
		this.landscapeManager.update();

		this.landscapeManager.updateSpeed();

		this.landscapeManager.updateCityMeshPoistion();

		this.landscapeManager.updatePlacements();

		this.landscapeManager.updateRewardPlacements();
	}

	dispose() {
		this.landscapeManager.dispose();
	}

	update() {}
}

export { District };
