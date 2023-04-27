export default class AnimationManager {
	constructor(context) {
		this.context = context;
		this.mixer = this.context.mixer;
	}

	playAnimationWithCrossFade(actionName, playerState) {
		this.context.animationManager.prepareCrossFade("_", actionName, 0.0);
		this.context.currentPlayerState = playerState;

		this.mixer.addEventListener("finished", () => {
			this.context.animationManager.prepareCrossFade("_", "runAction", 0);
			this.context.currentPlayerState =
				this.context.playerAnimationStates.running;
		});
	}

	playSlideAnimation() {
		this.playAnimationWithCrossFade(
			"slideAction",
			this.context.playerAnimationStates.sliding
		);
	}

	playJumpAnimation() {
		this.playAnimationWithCrossFade(
			"jumpAction",
			this.context.playerAnimationStates.jumping
		);
	}

	update(delta) {
		this.mixer.update(delta);
	}
}
