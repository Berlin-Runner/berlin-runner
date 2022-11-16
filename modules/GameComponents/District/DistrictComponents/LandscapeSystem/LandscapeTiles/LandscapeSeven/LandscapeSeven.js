import { Landscape } from "../../Landscape.js";
class LandscapeSeven extends Landscape {
	constructor() {
		super();
		this.landscapeModelFileUrl =
			"modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeSeven/Model/tiles.7.glb";
		return this.initLandscape(this.landscapeModelFileUrl);
	}

	updateLandscape() {
		/*
    add some update logic here if needed
    call this in the landcape generation manager
    */
	}
}

export { LandscapeSeven };
