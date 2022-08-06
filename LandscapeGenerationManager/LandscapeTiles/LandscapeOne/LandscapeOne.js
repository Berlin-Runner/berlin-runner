class LandscapeOne extends Landscape {
  constructor() {
    super();
    this.landscapeModelFileUrl =
      "/LandscapeGenerationManager/LandscapeTiles/LandscapeOne/Model/landscape_1.glb";
    return this.initLandscape(this.landscapeModelFileUrl);
  }

  updateLandscape() {
    /* 
    add some update logic here if needed
    call this in the landcape generation manager
    */
  }
}
