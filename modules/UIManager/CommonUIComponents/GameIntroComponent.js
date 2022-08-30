import { BaseUIComponent } from "../BaseUIComponent.js";
class GameIntroComponent extends BaseUIComponent {
  constructor(id, context) {
    super(id, context);
    console.log("setting up Game intro Screen");
    this.startGameButton = document.getElementById("start-game-button");
    this.setUpComponentEventListners();
    this.setupEventBusSubscriptions();
  }

  setUpComponentEventListners() {
    this.startGameButton.addEventListener("click", () => {
      console.log("start button pressed");
      this.startGame();
    });

    window.addEventListener("keypress", (e) => {
      if (e.code === "KeyM") {
        // SOURCE OF THE KEY PRESS HANDLE MUST BE A SINGLE POINT IN THE STSTEM
        /*   console.log("M is pressed");
        this.muteToggle(); */
      }
    });
  }

  setupEventBusSubscriptions() {
    console.log(this.stateBus);
    this.stateBus.subscribe("start_game", () => {
      this.hideComponent();
      this.hideStatic();
    });

    this.stateBus.subscribe("back_to_home", () => {
      this.showComponent();
      this.showStatic();
    });
  }

  startGame() {
    console.log("start game function");
    this.stateManager.startGame();
  }

  muteToggle() {
    /*    THIS IS CURRENTLY BEING HANDLED BY THE AUDIO MANAGER,
     PLEASE REFACTOR LATER WITH AN EVENT SYSTEM SO THAT EACH COMPONENT 
     HAS ITS OWN EVENT LISTENER AND DO ITS OWN IMPLEMENTATION OF MUTING AND UNMUTING */
  }
}

export { GameIntroComponent };
