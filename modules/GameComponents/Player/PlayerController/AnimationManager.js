export default class AnimationManager {
	constructor(context) {
		this.context = context;
		this.mixer = this.context.mixer;
	}

	playAnimationWithCrossFade(toActionName, fromActionName, playerState) {
		this.context.animationManager.prepareCrossFade(
			fromActionName,
			toActionName,
			0.0
		);
		this.context.currentPlayerState = playerState;

		this.mixer.addEventListener("finished", () => {
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
			"slideAction",
			"runAction",
			this.context.playerAnimationStates.sliding
		);
	}

	playJumpAnimation() {
		this.playAnimationWithCrossFade(
			"jumpAction",
			"runAction",
			this.context.playerAnimationStates.jumping
		);
	}

	update(delta) {
		this.mixer.update(delta);
	}
}
