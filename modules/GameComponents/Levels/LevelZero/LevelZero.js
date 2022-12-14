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
		this.levelStartCountDown = this.levelIntroUI.querySelector(
			".level-countdown-timer"
		);
		this.levelObjective = this.levelIntroUI.querySelector(".level-objective");
		this.levelCompleteUI = document.getElementById(
			"level-zero-complete-screen"
		);

		this.runningSound = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/running.mp3",
			isMute: false,
			doesLoop: true,
			volume: 1,
		});

		this.stateBus.subscribe("start_game", () => {
			if (this.activeLevel) {
				this.awake();
			}
		});
	}

	async awake() {
		let countDownTimer = 2;

		this.levelIntroUI.style.display = "flex";
		this.levelObjective.innerText = this.levelInfo.levelScoreObjcetive;

		let globalId = null;

		let pageLoadFunction = () => {
			setTimeout(() => {
				this.levelStartCountDown.innerText = countDownTimer;
				countDownTimer--;
				globalId = requestAnimationFrame(pageLoadFunction);
			}, 1000);
		};

		requestAnimationFrame(pageLoadFunction);

		/* level_one_coundown_intervalID = setInterval(() => {
			this.levelStartCountDown.innerText = countDownTimer;
			countDownTimer--;
		}, 1 * 1000); */

		setTimeout(() => {
			cancelAnimationFrame(globalId);
			// clearInterval(level_one_coundown_intervalID);
			this.levelIntroUI.style.display = "none";
			this.stateManager.enterPlay();
			this.runningSound.play();
		}, (countDownTimer + 1) * 1000);
	}

	async init() {
		// console.log(`${this.levelInfo.levelName} is waking up`);
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
		this.cityopts = {
			name: "berlin",
			tiles: [
				tileFive.clone(),
				tileOne.clone(),
				// tileTwo.clone(),
				tileEight.clone(),
				// tileFour.clone(),
				// tileSeven.clone(),
				tileThree.clone(),
				// tileTwo.clone(),
				// tileFour.clone(),
				tileOne.clone(),
				tileEight.clone(),
				// tileSix.clone(),
				tileEight.clone(),
				tileThree.clone(),
				// tileFive.clone(),
				// tileSeven.clone(),
				tileFour.clone(),
				// tileFour.clone(),
				tileSeven.clone(),
				tileOne.clone(),
				tileTwo.clone(),
				// tileFive.clone(),
				tileOne.clone(),
				tileEight.clone(),
				tileSix.clone(),
				// tileThree.clone(),
				// tileTwo.clone(),
				// tileEight.clone(),
				tileThree.clone(),
				// tileFive.clone(),
			],
		};

		this.city = new District(this.context, this.cityopts);

		// tileOne.then((res) => {
		// 	this.cityopts = {
		// 		name: "berlin",
		// 		tiles: [
		// 			res.clone(),
		// 			res.clone(),
		// 			res.clone(),
		// 			res.clone(),
		// 			res.clone(),
		// 			res.clone(),
		// 		],
		// 	};

		// 	this.city = new District(this.context, this.cityopts);
		// });
	}

	async start() {
		// console.log(`starting level : ${this.levelInfo.levelIndex}`);
		this.init();
	}

	dispose() {
		this.city.dispose();
		// delete all the other things
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
