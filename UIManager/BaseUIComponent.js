class BaseUIComponent {
  constructor(id, context) {
    this.context = context;
    this.stateManager = this.context.gameStateManager;
    this.stateBus = this.context.gameStateEventBus;
    this.scoreManager = this.context.gameScoreManager;
    this.scoreBus = this.context.scoreEventBus;
    this.healthBus = this.context.playerHealthEventBus;
    this.uiComponent = document.getElementById(id);
    this.staticNoise = document.getElementById("page_static");
  }

  hideStatic() {
    this.staticNoise.style.display = "none";
  }

  showStatic() {
    this.staticNoise.style.display = "flex";
  }

  hideComponent() {
    this.uiComponent.style.display = "none";
  }

  showComponent() {
    this.uiComponent.style.display = "flex";
  }

  listenToEvent(event, callback) {
    this.uiComponent.addEventListener(event, () => {
      callback();
    });
  }
}
