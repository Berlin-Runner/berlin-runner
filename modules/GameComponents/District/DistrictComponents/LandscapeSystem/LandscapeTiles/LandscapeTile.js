class LandscapeTile {
	constructor(context, tileUrl) {
		this.context = context;
		this.tileUrl = tileUrl;
		this.landscapeModelFileUrl =
			"modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeEight/Model/tiles.8.glb";
		return this.initLandscape(tileUrl);
	}

	async initLandscape(url) {
		try {
			let { model } = await this.context.assetLoader.loadModel(url);
			return model;
		} catch (err) {}
	}

	clone() {
		return new LandscapeTile(this.tileUrl);
	}
}

export { LandscapeTile };
