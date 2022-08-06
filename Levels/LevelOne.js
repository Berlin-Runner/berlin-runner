class LevelOne {
  constructor(context) {
    this.context = context;
    this.activeLevel = false;
    this.levelInfo = {
      levelName: "levelOne",
      levelIndex: 1,
    };

    console.log("this is level one");

    this.nextLevel = null;

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

  end() {
    if (this.nextLevel) {
      console.log("transitioning to the next level");
      this.nextLevel.start();
    } else {
      console.log("next level is null");
    }
  }

  update() {
    if (!this.city || !this.activeLevel) return;
    console.log("updating berlin babay");
    this.city.update();
  }
}
