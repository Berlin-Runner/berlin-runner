import { Coin } from "./Coin.js";
import { UTIL } from "../Util/UTIL.js";
class RewardGenerationManagement {
  constructor(context) {
    this.context = context;
    this.scene = this.context.gameWorld.scene;
    this.init();
  }

  init() {
    this.coin = new Coin();
    this.allRewardsGenerated = new THREE.Group();
  }

  placeReward(z, meshToPlace) {
    let reward = this.coin.getCoinGroup().clone();

    reward.position.z = z;
    reward.position.x =
      this.coin.coinPositionsX[UTIL.randomIntFromInterval(0, 2)];
    reward.position.y =
      this.coin.coinPositionsY[UTIL.randomIntFromInterval(0, 1)];

    this.allRewardsGenerated.add(reward);
    meshToPlace.add(reward);
  }
}

export { RewardGenerationManagement };
