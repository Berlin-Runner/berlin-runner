import { UTIL } from "../../../../../../Util/UTIL.js";

class Obstacle {
	constructor(context) {
		this.context = context;
		this.healthBus = this.context.playerHealthEventBus;
	}

	async loadObstacle(url) {
		// let { model, animations } = await this.context.assetLoader.loadModel(url);
		// return { model, animations };
	}

	async initObstacle(url) {
		let model = await this.loadObstacle(url);
		return model;
	}
}

export { Obstacle };
