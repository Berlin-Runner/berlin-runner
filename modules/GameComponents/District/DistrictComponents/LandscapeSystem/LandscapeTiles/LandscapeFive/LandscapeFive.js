import { Landscape } from "../../Landscape.js";
class LandscapeFive extends Landscape {
	constructor() {
		super();
		this.landscapeModelFileUrl =
			"modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeFive/Model/tiles.5.glb";
		return this.initLandscape(this.landscapeModelFileUrl);
	}

	updateLandscape() {
		/*
    add some update logic here if needed
    call this in the landcape generation manager
    */
	}
}

export { LandscapeFive };
