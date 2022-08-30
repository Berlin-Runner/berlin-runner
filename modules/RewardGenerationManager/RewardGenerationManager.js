import { Coin } from "./Coin.js";
import { UTIL } from "../Util/UTIL.js";
import { Vec3 } from "../../libs/cannon-es.js";
class RewardGenerationManagement {
  constructor(context) {
    this.context = context;
    this.scene = this.context.gameWorld.scene;

    this.modelLength = 37;

    this.delta = new THREE.Clock();

    this.coinPositionsX = [-2.5, 0, 2.5];
    this.coinPositionsY = [0.6, 1.2];
    this.init();
  }

  init() {}

  placeReward(z, meshToPlace) {
    let placementPostion = new THREE.Vector3(
      this.coinPositionsX[UTIL.randomIntFromInterval(0, 2)],
      this.coinPositionsY[UTIL.randomIntFromInterval(0, 1)],
      z
    );

    console.log(placementPostion);
    let reward = new Coin(this.context, placementPostion);
    reward = reward.coinMesh;
    // reward.position.copy(cannonToThreeVec3(placementPostion));
    // reward.collider.position = placementPostion;
    console.log(reward);

    this.scene.add(reward);
  }

  update() {}
}

function threeToCannonVec3(cannonvec3) {
  return new Vec3(cannonvec3.x, cannonvec3.y, cannonvec3.z);
}

function cannonToThreeVec3(cannonvec3) {
  return new THREE.Vector3(cannonvec3.x, cannonvec3.y, cannonvec3.z);
}

export { RewardGenerationManagement };
