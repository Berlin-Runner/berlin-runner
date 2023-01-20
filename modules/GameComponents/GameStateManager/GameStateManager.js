class GameStateManager {
	constructor(context) {
		this.context = context;

		this.gameStates = {
			notStartedYet: "not_started",
			pickingDistrict: "picking-district",
			pickingCharacter: "picking-character",
			started: "started",
			staged: "staged",
			inPlay: "in_play",
			paused: "paused",
			over: "game_over",
		};

		this.init();
	}

	init() {
		/*
		gsap.to(object.position, {
			x: position,
			duration,
			ease: "power4.out",
			onComplete: () => {
				setTimeout(finishCallBack, 500);
			},
		});
		*/

		document
			.getElementById("display-character-picker")
			.addEventListener("click", () => {
				// alert("showing the picker");
				document.getElementById("stage-screen").style.display = "none";
				this.showCharacterPicker();
			});

		document
			.getElementById("start-game-button-final")
			.addEventListener("click", () => {
				document.getElementById("stage-screen").style.display = "none";

				this.context.startingStage.position.y = -10;

				gsap.to(this.context.gameWorld.camera.rotation, {
					y: Math.PI,
					duration: 1,
					onComplete: () => {
						this.context.gameWorld.camera.lookAt(new THREE.Vector3(0, 2, 0));
					},
				});
				gsap.to(this.context.gameWorld.camera.position, {
					y: 2,
					z: 4,
					duration: 1.125,
					// ease: "power4.out",
					onComplete: () => {
						this.enterPlay();
					},
				});
				// this.context.gameWorld.camera.position.z = 4;
				// this.context.gameWorld.camera.position.y = 2;

				// alert("animate the camera and start the game");
			});

		this.currentState = this.gameStates.notStartedYet;
	}

	resetState() {
		this.currentState = this.gameStates.notStartedYet;
		this.context.gameStateEventBus.publish("back_to_home");
	}

	showCharacterPicker() {
		this.currentState = this.gameStates.pickingCharacter;
		this.context.gameStateEventBus.publish("pick-character");
	}

	showDistrictPicker() {
		this.currentState = this.gameStates.pickingDistrict;
		this.context.gameStateEventBus.publish("pick-district");
	}

	startGame(districtIndex) {
		this.currentState = this.gameStates.started;
		this.context.gameStateEventBus.publish("start_game", districtIndex);
	}

	enterStage() {
		document.getElementById("stage-screen").style.display = "flex";

		this.currentState = this.gameStates.staged;
		this.context.gameWorld.camera.position.z = -2;
		this.context.gameWorld.camera.position.y = 1;
		this.context.gameWorld.camera.lookAt(new THREE.Vector3(0, 1, 0));
		console.log(this.context.gameWorld.camera.position);

		this.context.gameStateEventBus.publish("enter_stage");
	}

	enterPlay() {
		this.currentState = this.gameStates.inPlay;
		this.scoreContainer = document.getElementById("score-holder");
		this.scoreContainer.style.display = "flex";
		this.context.gameStateEventBus.publish("enter_play");
	}

	pauseGame() {
		this.currentState = this.gameStates.paused;
		this.context.gameStateEventBus.publish("pause_game");
	}

	resumeGame() {
		this.currentState = this.gameStates.inPlay;
		this.context.gameStateEventBus.publish("resume_game");
	}

	restartGame() {
		this.currentState = this.gameStates.inPlay;
		this.context.cityContainer.position.z += 2;
		this.context.gameStateEventBus.publish("restart_game");
	}

	gameOver() {
		this.currentState = this.gameStates.over;
		this.context.gameStateEventBus.publish("game_over");
	}

	update() {}
}

export { GameStateManager };
