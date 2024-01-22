import { Level } from "../Level.js";
import { District } from "../../District/District.js";

class LevelZero extends Level {
	constructor(context) {
		let opts = {
			levelInfo: {
				levelName: "levelZero",
				levelIndex: 0,
				levelScoreObjcetive: 40,
			},
		};

		super(context, opts);

		this.start();

		this.levelIntroUI = document.getElementById("level-zero-intro-screen");

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.stateBus.subscribe("start_game", () => {
			if (this.activeLevel) {
				this.awake();
			}
		});
	}

	async awake() {
		this.stateManager.enterStage();
	}

	start() {
		this.init();
	}

	init() {
		/*
		CITY DESIGN
		*/
		this.cityopts = {
			name: "berlin",
			tiles: [
				this.context.landscapeTiles.tileNine,
				this.context.landscapeTiles.tileTwo.clone(),
				this.context.landscapeTiles.tileFour,
				this.context.landscapeTiles.tileSeven,
				this.context.landscapeTiles.tileTwo.clone(),
				this.context.landscapeTiles.tileSeven.clone(),
				this.context.landscapeTiles.tileThree,
				this.context.landscapeTiles.tileTwo,
				this.context.landscapeTiles.tileSeven.clone(),
				this.context.landscapeTiles.tileEight,
			],
			obstacles: [
				this.context.landscapeTiles.tileOne, //bus container
				this.context.landscapeTiles.tileFive, //river tile
				this.context.landscapeTiles.tileSix, //bridge tile
			],
		};

		this.city = new District(this.context, this.cityopts);
	}

	dispose() {
		this.city.dispose();
	}

	end(nextLevel) {
		super.end(nextLevel);
	}

	update() {
		if (!this.city || !this.activeLevel) return;
		this.city.update();
	}
}

export { LevelZero };
