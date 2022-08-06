class LevelZero {
  constructor(context) {
    this.context = context;
    this.activeLevel = false;
    this.levelInfo = {
      levelName: "levelZero",
      levelIndex: 0,
    };
    console.log("this is level zero");

    // this.city = null;

    this.nextLevel = null;

    this.awake();
  }

  async awake() {
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

  end() {
    console.log("transitioning to the next level");
    this.activeLevel = false;
    this.dispose();

    this.nextLevel = new LevelOne(this.context);
    this.nextLevel.activeLevel = true;
    this.context.currentLevel = this.nextLevel;
  }

  update() {
    if (!this.city || !this.activeLevel) return;
    this.city.update();
  }
}
