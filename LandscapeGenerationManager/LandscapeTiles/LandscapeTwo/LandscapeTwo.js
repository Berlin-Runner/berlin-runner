class LandscapeTwo extends Landscape {
  constructor() {
    super();
    this.landscapeModelFileUrl =
      "/LandscapeGenerationManager/LandscapeTiles/LandscapeTwo/Model/landscape_2.glb";
    return this.initLandscape(this.landscapeModelFileUrl);
  }

  updateLandscape() {
    /* 
    add some update logic here if needed
    call this in the landcape generation manager
    */
  }
}
