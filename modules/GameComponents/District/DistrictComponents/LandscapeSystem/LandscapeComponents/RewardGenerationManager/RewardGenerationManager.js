import { Coin } from "./Coin.js";
import { UTIL } from "../../../../../../Util/UTIL.js";
import { Vec3 } from "../../../../../../../libs/cannon-es.js";
import Donut from "./donut/donut.js";
import Coffee from "./coffee/coffee.js";
class RewardGenerationManagement {
	constructor(context) {
		this.context = context;
		this.scene = this.context.gameWorld.scene;

		this.delta = new THREE.Clock();

		this.coinPositionsX = [-2.5, 0, 2.5];
		this.coinPositionsY = [1, 1];

		this.spawnPosition = new THREE.Vector3(0, -10000, 1000);
		this.placementPostion = new THREE.Vector3(-2.5, 0, 0);

		this.init();
	}

	init() {
		// this.donutIndex = 0;
		// this.totalDonuts = 15;
		// this.donuts = [];

		this.coffeeIndex = 0;
		this.totalCoffees = 15;
		this.coffees = [];

		// let donut = new Donut(this.context, this.spawnPosition);
		let coffee = new Coffee(this.context, this.spawnPosition);

		// for (let index = 0; index < this.totalDonuts; index++) {
		// 	this.donuts.push(donut.clone());
		// }

		for (let index = 0; index < this.totalCoffees; index++) {
			this.coffees.push(coffee.clone());
		}

		console.log(this.coffees);
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

		// let reward_ = this.donuts[this.donutIndex % this.totalDonuts];
		// console.log(
		// 	`placing donut # ${this.donutIndex % this.totalDonuts} at zPos: ${
		// 		this.placementPostion.z
		// 	}`
		// );
		// reward_.updatePosition(this.placementPostion);
		// this.donutIndex++;

		let reward_ = this.coffees[this.coffeeIndex % this.totalCoffees];
		reward_.updatePosition(this.placementPostion);
		this.coffeeIndex++;
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
