import { LandscapeGenerationManager } from "../LandscapeGenerationManager/LandscapeGenerationManagement.js";
class City {
	constructor(context, opts) {
		this.context = context;
		this.opts = opts;
		this.name = this.opts.name;

		this.awake();
	}

	awake() {
		this.landscapeManager = new LandscapeGenerationManager(this.context, {
			tiles: this.opts.tiles,
		});

		this.start();
	}

	start() {
		requestAnimationFrame(
			this.landscapeManager.update.bind(this.landscapeManager)
		);
		requestAnimationFrame(
			this.landscapeManager.updateCityMeshPoistion.bind(this.landscapeManager)
		);
		requestAnimationFrame(
			this.landscapeManager.updatePlacements.bind(this.landscapeManager)
		);
	}

	dispose() {
		this.landscapeManager.dispose();
	}

	update() {
		// this.landscapeManager.updateCityMeshPoistion();
	}
}

export { City };
