class Level {
  // MAKE THIS A SUPER CLASS LATER , =)

  constructor(context, opts) {
    this.context = context;
    this.stateBus = this.context.gameStateEventBus;
    this.stateManager = this.context.gameStateManager;
    this.activeLevel = false;
    this.levelInfo = opts.levelInfo;

    this.nextLevel = null;
    this.city = null;
  }

  dispose() {}

  end(nextLevel) {
    this.activeLevel = false;
    this.dispose();

    this.nextLevel = nextLevel;
    this.nextLevel.activeLevel = true;
    this.context.currentLevel = this.nextLevel;
  }
}
