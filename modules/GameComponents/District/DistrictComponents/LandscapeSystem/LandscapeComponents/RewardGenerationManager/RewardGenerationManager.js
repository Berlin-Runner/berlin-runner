import { CoinGroup } from "./CoinGroup.js"
import { UTIL } from "../../../../../../Util/UTIL.js"
import Coffee from "./coffee/coffee.js"
class RewardGenerationManagement {
	constructor(context) {
		this.context = context
		this.scene = this.context.gameWorld.scene

		this.delta = new THREE.Clock()

		this.coinPositionsX = [-2.5, 0, 2.5]
		this.coinPositionsY = [1, 1]

		this.spawnPosition = new THREE.Vector3(0, 10000, 1000)
		this.coffeePlacementPostion = new THREE.Vector3(-2.5, 0, 0)
		this.coinPlacementPostion = new THREE.Vector3(-2.5, 0, 0)

		this.init()
	}

	init() {
		this.coffeeIndex = 0
		this.totalCoffees = 15
		this.coffees = []

		this.coinIndex = 0
		this.totalCoins = 5
		this.coins = []

		let coin = new CoinGroup(this.context, this.spawnPosition)
		let coffee = new Coffee(this.context, this.spawnPosition)

		for (let index = 0; index < this.totalCoins; index++) {
			this.coins.push(coin.clone())
		}

		for (let index = 0; index < this.totalCoffees; index++) {
			this.coffees.push(coffee.clone())
		}
	}

	setRewardPosition(rewardPosition, positionsX, positionsY, z) {
		rewardPosition.x =
			positionsX[UTIL.randomIntFromInterval(0, positionsX.length - 1)]
		rewardPosition.y =
			positionsY[UTIL.randomIntFromInterval(0, positionsY.length - 1)]
		rewardPosition.z = z
	}

	updateReward(rewards, index, totalRewards, position) {
		let reward = rewards[index % totalRewards]
		reward.updatePosition(position)
		return index + 1 // Return the updated index
	}

	placeReward(z) {
		// Set positions for coffee and coin rewards
		this.setRewardPosition(
			this.coffeePlacementPostion,
			this.coinPositionsX,
			this.coinPositionsY,
			z
		)
		this.setRewardPosition(
			this.coinPlacementPostion,
			this.coinPositionsX,
			this.coinPositionsY,
			z
		)

		// Update the rewards and increment their indices
		this.coinIndex = this.updateReward(
			this.coins,
			this.coinIndex,
			this.totalCoins,
			this.coinPlacementPostion
		)
		this.coffeeIndex = this.updateReward(
			this.coffees,
			this.coffeeIndex,
			this.totalCoffees,
			this.coffeePlacementPostion
		)
	}

	update() {}
}

export { RewardGenerationManagement }
