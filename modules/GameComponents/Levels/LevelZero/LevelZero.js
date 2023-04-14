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
				this.context.tileTwo.clone(),
				this.context.tileFour,
				this.context.tileSeven,
				this.context.tileTwo.clone(),
				this.context.tileSeven.clone(),
				this.context.tileThree,
				this.context.tileTwo,
				this.context.tileSeven.clone(),
				this.context.tileEight,
			],
			obstacles: [
				this.context.tileOne, //bus container
				this.context.tileFive, //river tile
				this.context.tileSix, //bridge tile
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
