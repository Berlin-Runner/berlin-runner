class LandscapeGenerationManager {
  constructor(context) {
    this.context = context;

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

  async init() {
    await this.initLandscape();

    this.landscapesArray = [
      this.model.clone(),
      this.model.clone(),
      this.model.clone(),
    ];

    this.z = -this.modelLength * this.landscapesArray.length;

    this.delta = new THREE.Clock();

    this.city = new THREE.Object3D();

    this.landscapesArray.forEach((child, index) => {
      child.position.z -= (this.modelLength - 0) * index;

      this.city.add(child);
    });

    let cityCenter = this.modelLength * this.landscapesArray.length * 0.5;

    this.city.position.z = cityCenter;

    this.scene.add(this.city);

    this.rewardManager = new RewardGenerationManagement(this.context);
  }

  async loadLandscape() {
    let { model } = await UTIL.loadModel("/assets/models/landscape_1.glb");

    return model.children[0];
  }

  async initLandscape() {
    this.model = await this.loadLandscape();
    let lanscapeMap = this.model.material.map;

    this.model.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
      class: THREE.CustomMaterial,

      vertex: {
        transformEnd: UTIL.getFoldableShader(),
      },
    });

    this.model.material.uniforms.map.value = lanscapeMap;

    if (this.settings.renderWireframe) {
      this.model.material.uniforms.diffuse.value = new THREE.Color("green");
      this.model.material.wireframe = this.settings.renderWireframe;
    } else {
      this.model.material.map = lanscapeMap;
    }
  }

  update() {
    if (!this.model || !this.settings.recycleCityTiles) return;

    let currentMesh =
      this.city.children[this.counter % this.landscapesArray.length];
    this.counter++;

    currentMesh.position.z = this.z;
    this.rewardManager.placeReward(this.z, this.city);
    this.z -= this.modelLength;
  }

  updateCityMeshPoistion() {
    if (this.city && this.settings.moveCity)
      this.city.position.z += this.modelLength * this.delta.getDelta();
  }
}
