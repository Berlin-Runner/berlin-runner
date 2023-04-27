import { Quaternion, Vec3 } from "../../../../libs/cannon-es.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";
/* class MovementFSM {
	constructor(context, player) {
		this.context = context;
		this.player = player;

		this.movementEventBus = this.context.playerMovementEventBus;

		this.tweenDuration = 0.75;
		this.cameraTweenDuration = 0.85;

		this.time = new THREE.Clock();

		this.canJump = true;
		this.canSlide = true;
		this.jumpVelocity = 2;

		this.lanes = {
			center: 0,
			left: -1,
			right: 1,
		};

		this.currentPlayerLane = this.lanes.center;

		this.listenForKeyboardInputs();
		this.listenForSwipeInputs();

		this.addClassSettings();

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
		// console.log(hammertime);

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
		this.movementEventBus.publish("player-slided");
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
		// if (this.canJump) {
		this.movementEventBus.publish("player-jumped");
		this.playJumpAnimation();

		this.canJump = true;
		this.context.G.PLAYER_JUMPING = this.canJump;

		gsap.to(this.player.position, {
			y: 1,
			duration: 0.2,

			onComplete: () =>
				gsap.to(this.player.position, {
					y: 0,
					duration: 0.3,

					// onComplete: () => alert("shit"),
				}),
		});

		setTimeout(() => {
			this.canJump = false;
			this.context.G.PLAYER_JUMPING = this.canJump;
		}, 1200);
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
		// this.moveObjectToPosition(
		// 	this.context.gameWorld.camera,
		// 	0,
		// 	this.cameraTweenDuration
		// );
		if (this.currentPlayerLane == this.lanes.left)
			this.rotateObject(this.player, Math.PI * 0.75);
		if (this.currentPlayerLane == this.lanes.right)
			this.rotateObject(this.player, Math.PI * 1.25);
		this.currentPlayerLane = this.lanes.center;
	}

	pullToCenter() {
		this.moveObjectToPosition(this.player, 0, 1);
		// this.moveObjectToPosition(this.context.gameWorld.camera, 0, 0.75);

		if (this.currentPlayerLane == this.lanes.left)
			this.rotateObject(this.player, Math.PI * 0.75);
		if (this.currentPlayerLane == this.lanes.right)
			this.rotateObject(this.player, Math.PI * 1.25);
		this.currentPlayerLane = this.lanes.center;
	}

	moveLeft() {
		this.movementEventBus.publish("player-side-moved");
		switch (this.currentPlayerLane) {
			case this.lanes.left:
				return;

			case this.lanes.right:
				this.moveToCenter();
				break;
			case this.lanes.center:
				this.currentPlayerLane = this.lanes.left;
				this.rotateObject(this.player, Math.PI * 1.25);
				// this.moveObjectToPosition(
				// 	this.context.gameWorld.camera,
				// 	-2.75,
				// 	this.cameraTweenDuration
				// );
				this.moveObjectToPosition(this.player, -2.5, this.tweenDuration, () => {
					if (this.keysDown.left) return;
					// this.pullToCenter();
				});

				break;
		}
	}

	moveRight() {
		this.movementEventBus.publish("player-side-moved");
		switch (this.currentPlayerLane) {
			case this.lanes.right:
				break;
			case this.lanes.left:
				this.moveToCenter();
				break;
			case this.lanes.center:
				this.rotateObject(this.player, Math.PI * 0.75);
				this.currentPlayerLane = this.lanes.right;
				// this.moveObjectToPosition(
				// 	this.context.gameWorld.camera,
				// 	2.75,
				// 	this.cameraTweenDuration
				// );
				this.moveObjectToPosition(this.player, 2.5, this.tweenDuration, () => {
					if (this.keysDown.right) return;
					// this.pullToCenter();
				});
				break;
		}
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("PLAYER-MOVEMENT-SETTINGS");
	}
}

export { MovementFSM }; */

// different camera follow approaches

/* update() {
		if (!this.camera || !this.player || !this.follow) return;
		this.camera.position.y =
			this.player.position.y + this.currentCameraOffset.y;
		this.camera.position.z =
			this.player.position.z + this.currentCameraOffset.z;
	} */

// update() {
// 	if (!this.camera || !this.player || !this.follow) return;

// 	const targetY = this.player.position.y + this.currentCameraOffset.y;
// 	const targetZ = this.player.position.z + this.currentCameraOffset.z;
// 	const targetX = this.player.position.x;
// 	const lerpFactor = 0.1;

// 	this.camera.position.y += (targetY - this.camera.position.y) * lerpFactor;
// 	this.camera.position.z += (targetZ - this.camera.position.z) * lerpFactor;
// 	this.camera.position.x += (targetX - this.camera.position.x) * lerpFactor;
// }
