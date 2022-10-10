import { LandscapeGenerationManager } from "../LandscapeGenerationManager/LandscapeGenerationManagement.js";
class City {
	constructor(context, opts) {
		this.context = context;
		this.opts = opts;
		this.name = this.opts.name;

		// console.log(`${this.name} has woken up `);

		this.awake();
	}

	awake() {
		this.landscapeManager = new LandscapeGenerationManager(this.context, {
			tiles: this.opts.tiles,
		});

		// this.landscapeWorker = new Worker("../workers/landscapeWorker.js");

		this.start();
	}

	start() {
		// this.landscapeWorker.postMessage({});

		// this.landscapeWorker.onmessage = () => {
		this.landscapeManager.update();
		this.landscapeManager.updateCityMeshPoistion();
		this.landscapeManager.updatePlacements();
		// };
	}

	dispose() {
		this.landscapeManager.dispose();
	}

	update() {
		// this.landscapeManager.updateCityMeshPoistion();
	}
}

export { City };
