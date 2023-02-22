import { UTIL } from "../../../../../Util/UTIL.js";
class LandscapeTile {
	constructor(tileUrl) {
		this.tileUrl = tileUrl;
		this.landscapeModelFileUrl =
			"modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeEight/Model/tiles.8.glb";
		return this.initLandscape(tileUrl);
	}

	async loadLandscape(url) {
		let { model } = await UTIL.loadModel(url);

		return model;
	}

	async initLandscape(url) {
		let model = await this.loadLandscape(url);

		this.model = model;

		return model;
	}

	clone() {
		return new LandscapeTile(this.tileUrl);
	}
}

export { LandscapeTile };
