import { Coin } from "./Coin.js";
import { UTIL } from "../../../../../../Util/UTIL.js";
import { Vec3 } from "../../../../../../../libs/cannon-es.js";
import Donut from "./donut/donut.js";
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
		// this.coinindex = 0;
		this.donutIndex = 0;

		// this.totalCoins = 2;
		this.totalDonuts = 5;
		// this.coins = [];
		this.donuts = [];

		// let coin = new Coin(this.context, this.spawnPosition);
		let donut = new Donut(this.context, this.spawnPosition);
		// let beer = new Beer(this.context, this.spawnPosition);

		// for (let index = 0; index < this.totalCoins; index++) {
		// 	this.coins.push(coin.clone());
		// 	// this.coins.push(beer.clone());
		// }

		for (let index = 0; index < this.totalDonuts; index++) {
			this.donuts.push(donut.clone());
			// this.coins.push(beer.clone());
		}
		console.log(this.donuts);
	}

	placeReward(z) {
		(this.placementPostion.x =
			this.coinPositionsX[UTIL.randomIntFromInterval(0, 2)]),
			(this.placementPostion.y =
				this.coinPositionsY[UTIL.randomIntFromInterval(0, 1)]),
			(this.placementPostion.z = z);

		// let reward = this.coins[this.coinindex % this.totalCoins];
		// reward.updatePosition(this.placementPostion);
		// this.coinindex++;

		let reward_ = this.donuts[this.donutIndex % this.totalDonuts];
		reward_.updatePosition(this.placementPostion);
		this.donutIndex++;
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
