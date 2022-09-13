import { Level } from "../Level.js";
class LevelOne extends Level {
	constructor(context) {
		let opts = {
			levelInfo: {
				levelName: "levelOne",
				levelIndex: 1,
			},
		};

		super(context, opts);

		this.awake();
	}

	async awake() {
		console.log(`${this.levelInfo.levelName} is waking up`);
		let tileTwo = await new LandscapeTwo();
		let opts = {
			name: "frankfurt",
			tiles: [
				tileTwo.clone(),
				tileTwo.clone(),
				tileTwo.clone(),
				tileTwo.clone(),
				tileTwo.clone(),
			],
		};

		this.city = new City(this.context, opts);

		console.log(`everything is ready for ${this.levelInfo.levelName}`);
	}

	start() {
		console.log(`startign level : ${this.levelInfo.levelIndex}`);
	}

	end(nextLevel) {
		super.end(nextLevel);
	}

	update() {
		if (!this.city || !this.activeLevel) return;
		console.log("updating berlin babay");
		this.city.update();
	}
}

export { LevelOne };
