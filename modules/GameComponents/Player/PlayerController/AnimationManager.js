import { AudioManager } from '../../../Core/AudioManager/AudioManager.js';
import { BaseAudioComponent } from '../../../Core/AudioManager/BaseAudioComponent.js';

export default class AnimationManager {
  constructor(context) {
    this.context = context;
    this.mixer = this.context.mixer;
    // Initialize AudioManager instance
    this.audioManager = AudioManager.getInstance();
    // Create and initialize the jump sound component
    this.jumpSound = new BaseAudioComponent(this.audioManager, {
      url: './assets/sounds/jump.mp3',
      isMute: false,
      doesLoop: false,
      volume: 1,
    });
    // Create and initialize the jump sound component
    this.slideSound = new BaseAudioComponent(this.audioManager, {
      url: './assets/sounds/slide.mp3',
      isMute: false,
      doesLoop: false,
      volume: 1,
    });
  }

  playAnimationWithCrossFade(toActionName, fromActionName, playerState) {
    this.context.animationManager.prepareCrossFade(
      fromActionName,
      toActionName,
      0.0
    );
    this.context.currentPlayerState = playerState;

    this.mixer.addEventListener('finished', () => {
      this.context.animationManager.prepareCrossFade(
        toActionName,
        fromActionName,
        0
      );
      this.context.currentPlayerState =
        this.context.playerAnimationStates.running;
    });
  }

  playSlideAnimation() {
    this.playAnimationWithCrossFade(
      'slideAction',
      'runAction',
      this.context.playerAnimationStates.sliding
    );
    // Play slide sound
    this.slideSound.play();
  }

  playJumpAnimation() {
    this.playAnimationWithCrossFade(
      'jumpAction',
      'runAction',
      this.context.playerAnimationStates.jumping
    );
    // Play jump sound
    this.jumpSound.play();
  }

  update(delta) {
    this.mixer.update(delta);
  }
}
