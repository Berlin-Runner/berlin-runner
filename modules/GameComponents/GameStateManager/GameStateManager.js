import { AudioManager } from '../../Core/AudioManager/AudioManager.js';
import { BaseAudioComponent } from '../../Core/AudioManager/BaseAudioComponent.js';

class GameStateManager {
  constructor(context) {
    this.context = context;
    // Initialize AudioManager instance
    this.audioManager = AudioManager.getInstance();

    this.gameStates = new Map([
      ['notStartedYet', 'not_started'],
      ['pickingDistrict', 'picking-district'],
      ['pickingCharacter', 'picking-character'],
      ['started', 'started'],
      ['staged', 'staged'],
      ['inPlay', 'in_play'],
      ['paused', 'paused'],
      ['over', 'game_over'],
    ]);

    this.switch = false;

    this._init();
  }

  _init() {
    this.currentState = this.gameStates.get('notStartedYet');
  }

  resetState() {
    this.currentState = this.gameStates.get('notStartedYet');
    this.context.gameStateEventBus.publish('back_to_home');
  }

  showCharacterPicker() {
    this.currentState = this.gameStates.get('pickingCharacter');

    this.context.gameStateEventBus.publish('pick-character');
  }

  showDistrictPicker() {
    this.currentState = this.gameStates.get('pickingDistrict');
    this.context.gameStateEventBus.publish('pick-district');
  }

  startGame(districtIndex) {
    this.currentState = this.gameStates.get('started');
    this.context.gameStateEventBus.publish('start_game', districtIndex);
  }

  enterStage() {
    this.currentState = this.gameStates.get('staged');
    this.context.gameStateEventBus.publish('enter_stage');
  }

  enterPlay() {
    this.currentState = this.gameStates.get('inPlay');
    document.getElementById('in-play-screen').style.display = 'flex';
    this.context.gameStateEventBus.publish('enter_play');
    this.audioManager.toggleRunningSound(true); // Start the running sound as soon as game play starts
  }

  pauseGame() {
    this.currentState = this.gameStates.get('paused');
    this.context.gameStateEventBus.publish('pause_game');
    this.audioManager.toggleRunningSound(false); // Pause the running sound
  }

  resumeGame() {
    this.currentState = this.gameStates.get('inPlay');
    this.context.gameStateEventBus.publish('resume_game');
    this.audioManager.toggleRunningSound(true); // Resume the running sound
  }

  restartGame() {
    this.currentState = this.gameStates.get('inPlay');

    console.log(this.context.cityContainer.children[0]);
    this.context.cityContainer.children[0].position.z += 13;
    this.context.gameStateEventBus.publish('restart_game');
  }

  gameOver() {
    this.currentState = this.gameStates.get('over');
    this.context.gameStateEventBus.publish('game_over');
    this.audioManager.toggleRunningSound(false); // Stop the running sound
  }

  update() {}
}

export { GameStateManager };
