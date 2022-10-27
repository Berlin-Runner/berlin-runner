import { Landscape } from "../../Landscape.js";
class LandscapeTwo extends Landscape {
	constructor() {
		super();
		this.landscapeModelFileUrl =
			"modules/GameComponents/District/DistrictComponents/LandscapeSystem//LandscapeTiles/LandscapeTwo/Model/landscape_2.glb";
		return this.initLandscape(this.landscapeModelFileUrl);
	}

	updateLandscape() {
		/*
    add some update logic here if needed
    call this in the landcape generation manager
    */
	}
}

export { LandscapeTwo };
