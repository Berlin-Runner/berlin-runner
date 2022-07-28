class Coin {
  constructor() {
    this.coinPositionsX = [-2, 0, 2];
    this.coinPositionsY = [0.75, 1.5];
    this.init();
  }

  init() {
    let coinGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16);
    let coinMaterial = THREE.extendMaterial(THREE.MeshStandardMaterial, {
      class: THREE.CustomMaterial,

      vertex: {
        transformEnd: UTIL.getFoldableShader(),
      },
    });

    coinMaterial.uniforms.diffuse.value = new THREE.Color("yellow");

    this.coinMesh = new THREE.Mesh(coinGeo, coinMaterial);
    this.coinMesh.rotation.set(90 * (Math.PI / 180), 0, 0);

    this.coinGroup = new THREE.Group();

    for (let i = 0; i < 4; i++) {
      let coinClone = this.coinMesh.clone();
      coinClone.position.z = i * 1.25;
      this.coinGroup.add(coinClone);
    }
  }

  detectsCollisionWithCoach() {}

  getCoinGroup() {
    if (!this.coinGroup) return;
    return this.coinGroup;
  }
}
