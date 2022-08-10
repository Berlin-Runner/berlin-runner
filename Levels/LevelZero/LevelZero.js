class LevelZero extends Level {
  constructor(context) {
    let opts = {
      levelInfo: {
        levelName: "levelZero",
        levelIndex: 0,
        levelScoreObjcetive: 4,
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

    level_one_coundown_intervalID = setInterval(() => {
      this.levelStartCountDown.innerText = countDownTimer;
      countDownTimer--;
    }, 1 * 1000);

    setTimeout(() => {
      clearInterval(level_one_coundown_intervalID);
      this.init();
      this.stateManager.enterPlay();
    }, (countDownTimer + 1) * 1000);
  }

  async init() {
    this.levelIntroUI.style.display = "none";
    console.log(`${this.levelInfo.levelName} is waking up`);
    let tileOne = await new LandscapeOne();
    let tileTwo = await new LandscapeTwo();
    let opts = {
      name: "berlin",
      tiles: [
        tileOne.clone(),
        tileOne.clone(),
        tileOne.clone(),
        tileTwo.clone(),
        tileTwo.clone(),
        tileTwo.clone(),
      ],
    };

    this.city = new City(this.context, opts);

    console.log(`everything is ready for ${this.levelInfo.levelName}`);
  }

  start() {
    console.log(`starting level : ${this.levelInfo.levelIndex}`);
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
