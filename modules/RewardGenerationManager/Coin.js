import {
  Vec3,
  Body,
  Sphere,
  Box,
  Quaternion,
  BODY_TYPES,
} from "../../libs/cannon-es.js";
import { BaseAudioComponent } from "../AudioManager/BaseAudioComponent.js";

class Coin {
  constructor(context, spawnPosition) {
    this.context = context;

    this.scoreBus = this.context.scoreEventBus;

    this.spawnPosition = spawnPosition;
    this.coinPositionsX = [-2.5, 0, 2.5];
    this.coinPositionsY = [0.6, 1.2];

    this.allColliders = [];
    this.modelLength = 37;

    this.delta = new THREE.Clock();

    this.settings = {
      coinColliderMass: 0.0,
    };

    this.audioComponent = new BaseAudioComponent(this.context, {
      url: "./assets/sounds/ding.mp3",
      isMute: false,
      doesLoop: false,
      volume: 0.75,
    });

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

    coinMaterial.uniforms.diffuse.value = new THREE.Color("yellow");

    this.coinMesh = new THREE.Mesh(coinGeo, coinMaterial);
    this.coinMesh.position.copy(this.spawnPosition);
    // this.coinMesh.position.z = -10;
    // console.log(this.coinMesh.position);
    this.coinMesh.rotation.set(90 * (Math.PI / 180), 0, 0);

    // this.coinGroup = new THREE.Group();

    // this.coinGroup.add(this.coinMesh);

    /* for (let i = 0; i < 1; i++) {
      let coinClone = this.coinMesh.clone();
      coinClone.position.z = i * 1.5;
      this.coinGroup.add(coinClone);
    } */

    // this.initCoinCollider();
    console.log(this.spawnPosition);

    this.attachCoinCollider(this.spawnPosition);
    this.update();
  }

  attachCoinCollider(colliderPosition) {
    const halfExtents = new Vec3(0.25, 0.25, 0.25);
    const boxShape = new Box(halfExtents);
    let coinCollider = new Body({
      mass: this.settings.coinColliderMass,
      material: this.physicsMaterial,
      // type: BODY_TYPES.STATIC,
    });
    coinCollider.addShape(boxShape);
    coinCollider.position.z = colliderPosition.z;

    this.context.world.addBody(coinCollider);
    this.allColliders.push(coinCollider);
    this.collider = coinCollider;
    console.log(coinCollider.position);
    this.setupEventListners(coinCollider);
  }

  setupEventListners(collider) {
    const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    const upAxis = new Vec3(0, 1, 0);
    const fwdAxis = new Vec3(0, 0, 1);
    collider.addEventListener("collide", (event) => {
      const { contact } = event;

      this.scoreBus.publish("add-score", 1 / 4);
      this.audioComponent.play();

      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if (contact.bi.id === this.context.playerCollider.id) {
        // bi is the player body, flip the contact normal
        // contact.ni.negate(contactNormal);
        this.scoreBus.publish("add-score", 1 / 4);
        this.audioComponent.play();
      } else {
        // bi is something else. Keep the normal as it is
        contactNormal.copy(contact.ni);
      }

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (contactNormal.dot(upAxis) > 0.5) {
        console.log("collision is heard from the coin");
        // Use a "good" threshold value between 0 and 1 here!
        this.canJump = true;
      }
    });
  }

  detectsCollisionWithCoach() {}

  getCoinGroup() {
    if (!this.coinGroup) return;
    return this.coinGroup;
  }

  getCoin() {
    return this.coinMesh;
  }

  update() {
    requestAnimationFrame(this.update.bind(this));

    this.collider.position.z += (this.modelLength / 2) * this.delta.getDelta();
    this.coinMesh.position.z = this.collider.position.z;
    this.collider.position.y = this.coinMesh.position.y;
    this.collider.position.x = this.coinMesh.position.x;
  }
}

function cannonToThreeVec3(cannonvec3) {
  return new THREE.Vector3(cannonvec3.x, cannonvec3.y, cannonvec3.z);
}

function threeToCannonVec3(threeVec3) {
  return new Vec3(threeVec3.x, threeVec3.y, threeVec3.z);
}

export { Coin };
