import { UTIL } from "../Util/UTIL.js";
class FirstAid {
	constructor(context) {
		this.context = context;
		this.healthBus = this.context.playerHealthEventBus;
		this.scene = this.context.gameWorld.scene;
	}

	async loadFirstAidKit(url) {
		let { model } = await UTIL.loadModel(url);

		console.log(model);

		return model;
	}

	async initFirstAidKit(url) {
		let model = await this.loadFirstAidKit(url);

		return model;
	}
}

export { FirstAid };
