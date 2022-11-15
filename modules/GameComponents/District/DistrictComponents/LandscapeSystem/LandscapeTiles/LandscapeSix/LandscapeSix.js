import { Landscape } from "../../Landscape.js";
class LandscapeSix extends Landscape {
	constructor() {
		super();
		this.landscapeModelFileUrl =
			"modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeSix/Model/tiles.6.glb";
		return this.initLandscape(this.landscapeModelFileUrl);
	}

	updateLandscape() {
		/*
    add some update logic here if needed
    call this in the landcape generation manager
    */
	}
}

export { LandscapeSix };
