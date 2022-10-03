import { Level } from "../Level.js";
import { LandscapeOne } from "../../LandscapeGenerationManager/LandscapeTiles/LandscapeOne/LandscapeOne.js";
import { City } from "../../City/City.js";

import { BaseAudioComponent } from "../../AudioManager/BaseAudioComponent.js";

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
		let countDownTimer = 4;
		let level_one_coundown_intervalID;

		this.levelIntroUI.style.display = "flex";
		this.levelObjective.innerText = this.levelInfo.levelScoreObjcetive;

		this.init();

		level_one_coundown_intervalID = setInterval(() => {
			this.levelStartCountDown.innerText = countDownTimer;
			countDownTimer--;
		}, 1 * 1000);

		setTimeout(() => {
			clearInterval(level_one_coundown_intervalID);
			this.levelIntroUI.style.display = "none";
			this.stateManager.enterPlay();
			this.runningSound.play();
		}, (countDownTimer + 1) * 1000);
	}

	async init() {
		// console.log(`${this.levelInfo.levelName} is waking up`);
		let tileOne = new LandscapeOne();
		tileOne.then((res) => {
			this.cityopts = {
				name: "berlin",
				tiles: [
					res.clone(),
					res.clone(),
					res.clone(),
					res.clone(),
					res.clone(),
					res.clone(),
				],
			};

			this.city = new City(this.context, this.cityopts);
		});

		// console.log(`everything is ready for ${this.levelInfo.levelName}`);
	}

	start() {
		// console.log(`starting level : ${this.levelInfo.levelIndex}`);
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
