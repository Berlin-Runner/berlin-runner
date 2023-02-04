import { Quaternion, Vec3 } from "../../../libs/cannon-es.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";
class MovementFSM {
	constructor(context, player) {
		this.context = context;
		this.player = player;

		this.tweenDuration = 0.75;
		this.cameraTweenDuration = 0.85;

		this.canJump = true;
		this.canSlide = true;
		this.jumpVelocity = 12;

		this.lanes = {
			center: 0,
			left: -1,
			right: 1,
		};

		this.currentPlayerLane = this.lanes.center;

		this.velocity = this.context.playerCollider.velocity;

		this.listenForKeyboardInputs();
		this.listenForSwipeInputs();

		this.addClassSettings();

		this.jumpAudio = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/jump.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.05,
		});

		this.jumpSound = new Audio("./assets/sounds/jump.mp3");
		this.jumpSound.load();

		this.keysDown = {
			left: false,
			right: false,
			space: false,
			slide: false,
		};

		this.resetToCenter = true;

		this.moveToCenter();

		this.isSliding = false;
	}

	listenForSwipeInputs() {
		let hammertime = new Hammer(document.getElementById("webgl"), {});

		hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

		hammertime.on("swipeleft", (e) => {
			this.moveLeft();
		});

		hammertime.on("swiperight", (e) => {
			this.moveRight();
		});

		hammertime.on("swipedown", (e) => {
			this.slide();
		});

		hammertime.on("swipeup", (e) => {
			this.jump();
		});
	}

	listenForKeyboardInputs() {
		window.addEventListener("keydown", (e) => {
			switch (e.code) {
				case "KeyS":
					this.keysDown.slide = true;
					this.slide();
					break;
				case "KeyA":
					this.keysDown.left = true;
					this.moveLeft();

					break;

				case "KeyD":
					this.keysDown.right = true;
					this.moveRight();

					break;

				case "Space":
					this.keysDown.jump = true;
					this.jump();
					break;

				default:
					break;
			}
		});

		window.addEventListener("keyup", (e) => {
			switch (e.code) {
				case "KeyS":
					this.keysDown.slide = false;
					break;
				case "KeyA":
					this.keysDown.left = false;
					break;

				case "KeyD":
					this.keysDown.right = false;
					break;

				case "Space":
					this.keysDown.jump = false;
					break;

				default:
					break;
			}
		});
	}

	playSlideAnimation() {
		this.context.animationManager.prepareCrossFade("_", "slideAction", 0.5);
		this.context.currentPlayerState =
			this.context.playerAnimationStates.sliding;
		this.context.mixer.addEventListener("finished", () => {
			this.context.animationManager.prepareCrossFade("_", "runAction", 0);
			this.context.currentPlayerState =
				this.context.playerAnimationStates.running;
		});
	}

	slide() {
		this.playSlideAnimation();
		this.isSliding = true;
		this.context.G.PLAYER_SLIDING = this.isSliding;
		setTimeout(() => {
			this.player.position.y = 0;
			this.isSliding = false;
			this.context.G.PLAYER_SLIDING = this.isSliding;
		}, 1200);
	}

	playJumpAnimation() {
		this.context.animationManager.prepareCrossFade("_", "jumpAction", 0.0);
		this.context.currentPlayerState =
			this.context.playerAnimationStates.jumping;
		this.context.currentAction = this.context.playerActions["jumpAction"];
		this.context.mixer.addEventListener("finished", () => {
			this.context.animationManager.prepareCrossFade("_", "runAction", 0.0);
			this.context.currentPlayerState =
				this.context.playerAnimationStates.running;
		});
	}

	jump() {
		if (this.canJump) {
			this.playJumpAnimation();
			this.jumpAudio.play();
			this.velocity.y = this.jumpVelocity;
		}
		this.canJump = false;
		this.context.G.PLAYER_JUMPING = !this.canJump;
	}

	moveObjectToPosition(object, position, duration, finishCallBack) {
		gsap.to(object.position, {
			x: position,
			duration,
			ease: "power4.out",
			onComplete: () => {
				setTimeout(finishCallBack, 500);
			},
		});
	}

	rotateObject(object, angle) {
		gsap.to(object.rotation, {
			y: angle,
			duration: this.tweenDuration / 6,
			ease: "power4.out",
			onComplete: () => {
				gsap.to(object.rotation, {
					y: Math.PI,
					duration: this.tweenDuration / 2,
				});
			},
		});
	}

	moveToCenter() {
		this.moveObjectToPosition(this.player, 0, this.tweenDuration);
		this.moveObjectToPosition(
			this.context.gameWorld.camera,
			0,
			this.cameraTweenDuration
		);
		if (this.currentPlayerLane == this.lanes.left)
			this.rotateObject(this.player, Math.PI * 0.75);
		if (this.currentPlayerLane == this.lanes.right)
			this.rotateObject(this.player, Math.PI * 1.25);
		this.currentPlayerLane = this.lanes.center;
	}

	pullToCenter() {
		this.moveObjectToPosition(this.player, 0, 0.75);
		this.moveObjectToPosition(this.context.gameWorld.camera, 0, 0.75);

		if (this.currentPlayerLane == this.lanes.left)
			this.rotateObject(this.player, Math.PI * 0.75);
		if (this.currentPlayerLane == this.lanes.right)
			this.rotateObject(this.player, Math.PI * 1.25);
		this.currentPlayerLane = this.lanes.center;
	}

	moveLeft() {
		switch (this.currentPlayerLane) {
			case this.lanes.left:
				return;

			case this.lanes.right:
				this.moveToCenter();
				break;
			case this.lanes.center:
				this.currentPlayerLane = this.lanes.left;
				this.rotateObject(this.player, Math.PI * 1.25);
				this.moveObjectToPosition(
					this.context.gameWorld.camera,
					-2.75,
					this.cameraTweenDuration
				);
				this.moveObjectToPosition(this.player, -2.5, this.tweenDuration, () => {
					if (this.keysDown.left) return;
					this.pullToCenter();
				});

				break;
		}
	}

	moveRight() {
		switch (this.currentPlayerLane) {
			case this.lanes.right:
				break;
			case this.lanes.left:
				this.moveToCenter();
				break;
			case this.lanes.center:
				this.rotateObject(this.player, Math.PI * 0.75);
				this.currentPlayerLane = this.lanes.right;
				this.moveObjectToPosition(
					this.context.gameWorld.camera,
					2.75,
					this.cameraTweenDuration
				);
				this.moveObjectToPosition(this.player, 2.5, this.tweenDuration, () => {
					if (this.keysDown.right) return;
					this.pullToCenter();
				});
				break;
		}
	}

	updatePlayerColliderPosition() {
		if (this.resetToCenter) {
			this.context.playerInstance.player.position.set(
				0,
				this.context.playerInstance.player.position.y,
				0
			);
			this.context.playerCollider.position.set(
				0,
				this.context.playerCollider.position.y,
				0
			);

			this.resetToCenter = false;

			return;
		}

		this.context.playerCollider.position.x =
			this.context.playerInstance.player.position.x;

		if (!this.isSliding)
			this.context.playerInstance.player.position.y =
				this.context.playerCollider.position.y - 1;

		this.context.playerCollider.position.z =
			this.context.playerInstance.player.position.z;

		if (!this.isSliding)
			this.context.playerCollider.quaternion = new Quaternion(0, 0, 0, 1);
	}

	update() {
		this.updatePlayerColliderPosition();
		if (this.velocity.y < 0.75) this.canJump = true;
		if (
			this.context.playerInstance &&
			this.context.playerInstance.player.position.y > 0.75
		) {
			this.canJump = false;
		}
		this.context.G.PLAYER_JUMPING = !this.canJump;
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("PLAYER-MOVEMENT-SETTINGS");
	}
}

export { MovementFSM };
