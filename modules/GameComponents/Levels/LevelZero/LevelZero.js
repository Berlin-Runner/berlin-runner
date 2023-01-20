import { Level } from "../Level.js";
import { District } from "../../District/District.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";
import { LandscapeTile } from "../../District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeTile.js";

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

	async start() {
		this.init();
	}

	async init() {
		/*
		LOADING THE MODELS
		*/
		let tileOne = await new LandscapeTile("assets/models/tiles/tiles.1.2.glb");
		let tileTwo = await new LandscapeTile("assets/models/tiles/tiles.2.3.glb");
		let tileThree = await new LandscapeTile(
			"assets/models/tiles/tiles.3.2.glb"
		);
		let tileFour = await new LandscapeTile("assets/models/tiles/tiles.4.glb");
		let tileFive = await new LandscapeTile("assets/models/tiles/tiles.5.glb");
		let tileSix = await new LandscapeTile("assets/models/tiles/tiles.6.3.glb");
		let tileSeven = await new LandscapeTile("assets/models/tiles/tiles.7.glb");
		let tileEight = await new LandscapeTile("assets/models/tiles/tiles.8.glb");

		/*
		CITY DESIGN
		*/
		this.cityopts = {
			name: "berlin",
			tiles: [
				tileSeven.clone(),
				tileTwo.clone(),
				tileThree.clone(),
				tileSeven.clone(),
				tileEight.clone(),
				tileSix.clone(),
				tileFour.clone(),
				tileTwo.clone(),
				tileOne.clone(),
				tileFive.clone(),
				tileTwo.clone(),
				tileSeven.clone(),
				tileEight.clone(),
				tileOne.clone(),
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
