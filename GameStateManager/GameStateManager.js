class GameStateManager {
  constructor(context) {
    this.context = context;

    this.gameStates = {
      notStartedYet: "not_started",
      started: "started",
      inPlay: "in_play",
      paused: "paused",
      over: "game_over",
    };

    this.init();
  }

  init() {
    this.currentState = gameStates.notStartedYet;
  }

  startGame() {
    console.log("SWITCHING GAME STATE TO PLAYING");
    // hide loader stuff,
    currentState = gameStates.inPlay;
  }

  enterPlay() {}

  pauseGame() {}

  gameOver() {
    // audio.audio.volume = 0.25;
    audioManager.setVolume(0.25);
    runAction.crossFadeTo(deadAction, 1, true).play();
    runAction.stop();
    stopAction.crossFadeFrom(deadAction, 0.25, true).play();
    deadAction.stop();
    currentState = gameStates.over;
    setTimeout(() => {
      game_over_screen.style.display = "flex";
      page_static.style.display = "flex";
      final_score.innerText = currentScore;
      currentScore = 0;
    }, 1.25 * 1000);
  }

  update() {}
}
