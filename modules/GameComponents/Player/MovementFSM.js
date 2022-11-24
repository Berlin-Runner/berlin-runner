/* import {
	Vec3,
	Body,
	Sphere,
	Box,
	Quaternion,
} from "../../../libs/cannon-es.js";
 */
import { Quaternion } from "../../../libs/cannon-es.js";
// import { Quaternion÷ } from "../../../libs/cannon-es";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";
class MovementFSM {
	constructor(context, player) {
		this.context = context;
		this.player = player;

		this.tweenDuration = 0.75;
		this.cameraTweenDuration = 0.85;

		this.canJump = true;
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
			this.context.zenBenActions[5].play();
		});

		hammertime.on("swipeup", (e) => {
			this.jump();
		});
	}

	listenForKeyboardInputs() {
		window.addEventListener("keydown", (e) => {
			switch (e.code) {
				case "KeyS":
					this.context.zenBenActions[5].play();
					break;
				case "KeyA":
					this.moveLeft();

					break;

				case "KeyD":
					this.moveRight();

					break;

				case "Space":
					this.jump();
					break;

				default:
					break;
			}
		});

		window.addEventListener("keyup", (e) => {
			switch (e.code) {
				case "KeyA":
					this.moveLeft();

					break;

				case "KeyD":
					this.moveRight();

					break;

				case "Space":
					// this.context.zenBenActions[4].stop();
					break;

				default:
					break;
			}
		});
	}

	jump() {
		if (this.canJump) {
			this.jumpAudio.play();
			this.context.zenBenActions[4].play();
			console.log("jumping");
			this.velocity.y = this.jumpVelocity;
		}
		this.canJump = false;
	}

	moveObjectToPosition(object, position, duration, finishCallBack) {
		gsap.to(object.position, {
			x: position,
			duration,
			ease: "power4.out",
			onComplete: finishCallBack,
		});
	}

	moveToCenter() {
		console.log("moving to center");
		this.moveObjectToPosition(this.player, 0, this.tweenDuration);
		this.moveObjectToPosition(
			this.context.gameWorld.camera,
			0,
			this.cameraTweenDuration
		);
		this.currentPlayerLane = this.lanes.center;
	}

	pullBackToCenter() {
		this.moveObjectToPosition(this.context.playerCollider, 0, 0.1);
		this.moveObjectToPosition(this.context.gameWorld.camera, 0, 0.1);
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
				this.moveObjectToPosition(
					this.context.playerCollider,
					-2.5,
					this.tweenDuration,
					() => {
						this.moveObjectToPosition(this.context.playerCollider, 0, 0.5);
						this.moveObjectToPosition(this.context.gameWorld.camera, 0, 0.5);
						this.currentPlayerLane = this.lanes.center;
					}
				);
				this.currentPlayerLane = this.lanes.left;
				this.moveObjectToPosition(
					this.context.gameWorld.camera,
					-2.75,
					this.cameraTweenDuration
					// this.pullBackToCenter()
				);

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
				this.moveObjectToPosition(
					this.context.playerCollider,
					2.5,
					this.tweenDuration,
					() => {
						this.moveObjectToPosition(this.context.playerCollider, 0, 0.5);
						this.moveObjectToPosition(this.context.gameWorld.camera, 0, 0.5);
						this.currentPlayerLane = this.lanes.center;
					}
				);
				this.moveObjectToPosition(
					this.context.gameWorld.camera,
					2.75,
					this.cameraTweenDuration
					// this.pullBackToCenter()
				);
				this.currentPlayerLane = this.lanes.right;
				break;
		}
	}

	updatePlayerColliderPosition() {
		this.context.playerInstance.player.position.x =
			this.context.playerCollider.position.x;

		this.context.playerInstance.player.position.y =
			this.context.playerCollider.position.y - 1;

		this.context.playerCollider.position.z =
			this.context.playerInstance.player.position.z;

		this.context.playerCollider.quaternion = new Quaternion(0, 0, 0, 1);
	}

	update() {
		this.updatePlayerColliderPosition();
		if (this.velocity.y < 0.75) this.canJump = true;
		if (this.context.playerInstance.player.position.y > 0.75)
			this.canJump = false;
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("PLAYER-MOVEMENT-SETTINGS");
	}
}

export { MovementFSM };
