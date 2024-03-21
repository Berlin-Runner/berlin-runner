import { GameIntroComponent } from './CommonUIComponents/GameIntroComponent.js';
import { RadioPlayerComponent } from './CommonUIComponents/RadioPlayerComponent.js';
import { GamePlayComponent } from './CommonUIComponents/GamePlayComponent.js';
import { GamePausedComponent } from './CommonUIComponents/GamePausedComponent.js';
import { GameOverComponent } from './CommonUIComponents/GameOverComponent.js';

import StageUI from './StageUI.js';
class UIManager {
  constructor(context) {
    this.context = context;
    this.setupUIComponents();
  }

  setupUIComponents() {
    this.radioPlayerComponent = new RadioPlayerComponent(
      'radio-player',
      this.context
    );
    // No need to hide or show the component based on game states

    this.gameIntroComponent = new GameIntroComponent(
      'intro-screen',
      this.context
    );
    this.gameIntroComponent.showComponent();
    this.gameIntroComponent.showStatic();

    this.stageUIComponent = new StageUI('stage-screen', this.context);

    this.gamePlayComponent = new GamePlayComponent(
      'in-play-screen',
      this.context
    );

    this.gamePlayComponent.showComponent();
    this.gamePlayComponent.showStatic();

    this.gamePausedComponent = new GamePausedComponent(
      'paused-screen',
      this.context
    );
    this.gamePausedComponent.hideComponent();

    this.gameOverComponent = new GameOverComponent(
      'game-over-screen',
      this.context
    );
    this.gameOverComponent.hideComponent();
  }
}

export { UIManager };
