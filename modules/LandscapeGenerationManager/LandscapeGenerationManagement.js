class LandscapeGenerationManager {
  constructor(context, opts = null) {
    this.context = context;
    this.opts = opts;

    this.scene = this.context.gameWorld.scene;
    this.model = null;

    this.counter = 0;
    this.modelLength = 37;

    this.settings = {
      renderWireframe: false,
      moveCity: true,
      recycleCityTiles: true,
    };

    this.init();
  }

  init() {
    if (this.opts != null) {
      console.log("constructing the city using tiles from level");
      this.landscapesArray = this.opts.tiles;
    } else {
      console.log("NO CITY TILES PASSED");
    }

    this.z = -this.modelLength * this.landscapesArray.length;

    this.delta = new THREE.Clock();

    this.city = new THREE.Object3D();

    this.landscapesArray.forEach((child, index) => {
      child.position.z -= (this.modelLength - 0) * index;

      this.city.add(child);
    });

    let cityCenter = this.modelLength * this.landscapesArray.length * 0.5;

    this.city.position.z = cityCenter;
    // this.context.playerInstance.position.z = cityCenter;
    this.rewardManager = null;

    this.scene.add(this.city);

    this.rewardManager = new RewardGenerationManagement(this.context);
  }

  update() {
    if (!this.settings.recycleCityTiles) return;

    let currentMesh =
      this.city.children[this.counter % this.landscapesArray.length];
    this.counter++;

    currentMesh.position.z = this.z;
    /*  if (this.counter % 3 === 0)
      this.rewardManager.placeReward(this.z, this.city); */
    this.z -= this.modelLength;
  }

  updateCityMeshPoistion() {
    if (this.city && this.settings.moveCity)
      this.city.position.z += (this.modelLength / 2) * this.delta.getDelta();
  }

  dispose() {
    this.city.visible = false;
  }
}
