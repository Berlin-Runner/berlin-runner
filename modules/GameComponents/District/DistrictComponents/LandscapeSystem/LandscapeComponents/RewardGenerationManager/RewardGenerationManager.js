import { Coin } from "./Coin.js";
import { UTIL } from "../../../../../../Util/UTIL.js";
import { Vec3 } from "../../../../../../../libs/cannon-es.js";
class RewardGenerationManagement {
	constructor(context) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.delta = new THREE.Clock();

		this.coinPositionsX = [-2.5, 0, 2.5];
		this.coinPositionsY = [1, 2.25];

		this.spawnPosition = new THREE.Vector3(0, 0, 2000);
		this.placementPostion = new THREE.Vector3(0, 0, 0);

		this.init();
	}

	init() {
		this.coinindex = 0;

		this.totalCoins = 20;
		this.coins = [];

		let coin = new Coin(this.context, this.spawnPosition);

		for (let index = 0; index < this.totalCoins; index++) {
			this.coins.push(coin.clone());
		}
	}

	placeReward(z) {
		(this.placementPostion.x =
			this.coinPositionsX[UTIL.randomIntFromInterval(0, 2)]),
			(this.placementPostion.y =
				this.coinPositionsY[UTIL.randomIntFromInterval(0, 1)]),
			(this.placementPostion.z = z);

		let reward = this.coins[this.coinindex % this.totalCoins];
		reward.updatePosition(this.placementPostion);
		this.coinindex++;
		reward = reward.coinMesh;
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
