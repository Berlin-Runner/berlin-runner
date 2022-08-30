import { Vec3, Body, Sphere, Box, Quaternion } from "../../libs/cannon-es.js";
class Coin {
  constructor() {
    this.coinPositionsX = [-2.5, 0, 2.5];
    this.coinPositionsY = [0.6, 1.2];
    this.init();
  }

  init() {
    let coinGeo = new THREE.CylinderGeometry(0.125, 0.25, 0.1, 16);
    let coinMaterial = THREE.extendMaterial(THREE.MeshStandardMaterial, {
      class: THREE.CustomMaterial,

      /* vertex: {
        transformEnd: UTIL.getFoldableShader(),
      }, */
    });

    // this.initCoinCollider();

    coinMaterial.uniforms.diffuse.value = new THREE.Color("yellow");

    this.coinMesh = new THREE.Mesh(coinGeo, coinMaterial);
    this.coinMesh.rotation.set(90 * (Math.PI / 180), 0, 0);

    this.coinGroup = new THREE.Group();

    for (let i = 0; i < 1; i++) {
      let coinClone = this.coinMesh.clone();
      coinClone.position.z = i * 1.5;
      this.coinGroup.add(coinClone);
    }
  }

  initCoinCollider() {
    const halfExtents = new Vec3(0.125, 0.125, 0.125);
    const boxShape = new Box(halfExtents);
    this.context.coinCollider = new Body({
      mass: this.settings.coinColliderMass,
      material: this.physicsMaterial,
    });
    this.context.coinCollider.addShape(boxShape);
    this.context.coinCollider.position = threeToCannonVec3(
      this.player.position
    );
    this.context.coinCollider.linearDamping =
      this.settings.playerLinearDampeneingFactor;
    this.context.coinCollider.allowSleep = false;
    this.context.world.addBody(this.context.coinCollider);
  }

  detectsCollisionWithCoach() {}

  getCoinGroup() {
    if (!this.coinGroup) return;
    return this.coinGroup;
  }

  update() {}
}

export { Coin };
