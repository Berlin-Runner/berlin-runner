import { UTIL } from "../../../../../../Util/UTIL.js";

class Reward {
	constructor(context) {
		this.context = context;
		this.healthBus = this.context.playerHealthEventBus;
	}

	async loadReward(url) {
		let { model } = await this.context.assetLoader.loadModel(url);

		return model.children[0];
	}

	async initReward(url) {
		let model = await this.loadReward(url);

		return model;
	}
}

export { Reward };
