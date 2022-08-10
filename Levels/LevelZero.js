class LevelZero extends Level {
  constructor(context) {
    let opts = {
      levelInfo: {
        levelName: "levelZero",
        levelIndex: 0,
      },
    };

    super(context, opts);

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

  end(nextLevel) {
    super.end(nextLevel);
  }

  update() {
    if (!this.city || !this.activeLevel) return;
    this.city.update();
  }
}
