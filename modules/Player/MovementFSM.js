import { Vec3, Body, Sphere, Box, Quaternion } from "../../libs/cannon-es.js";
import { BaseAudioComponent } from "../AudioManager/BaseAudioComponent.js";
class MovementFSM {
	constructor(context, player) {
		this.context = context;
		this.player = player;

		this.tweenDuration = 0.75;
		this.cameraTweenDuration = 0.85;

		this.canJump = true;
		this.jumpVelocity = 10;

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

		hammertime.on("swipeup", (e) => {
			this.jump();
		});
	}

	listenForKeyboardInputs() {
		window.addEventListener("keypress", (e) => {
			switch (e.code) {
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
	}

	jump() {
		// TODO
		if (this.canJump) {
			this.jumpAudio.play();
			console.log("jumping");
			this.velocity.y = this.jumpVelocity;
			/*  gsap.to(this.velocity, {
        y: this.jumpVelocity,
        duration: 0.1,
        ease: "power3.in",
      }); */
		}
		this.canJump = false;
	}

	moveObjectToPosition(object, position, duration) {
		gsap.to(object.position, {
			x: position,
			duration,
			ease: "power4.out",
		});
	}

	moveToCenter() {
		this.moveObjectToPosition(this.player, 0, this.tweenDuration);
		this.moveObjectToPosition(
			this.context.gameWorld.camera,
			0,
			this.cameraTweenDuration
		);
		this.currentPlayerLane = this.lanes.center;
	}

	moveLeft() {
		switch (this.currentPlayerLane) {
			case this.lanes.left:
				break;
			case this.lanes.right:
				this.moveToCenter();
				break;
			case this.lanes.center:
				this.moveObjectToPosition(this.player, -2.5, this.tweenDuration);
				this.moveObjectToPosition(
					this.context.gameWorld.camera,
					-2.75,
					this.cameraTweenDuration
				);
				this.currentPlayerLane = this.lanes.left;
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
				this.moveObjectToPosition(this.player, 2.5, this.tweenDuration);
				this.moveObjectToPosition(
					this.context.gameWorld.camera,
					2.75,
					this.cameraTweenDuration
				);
				this.currentPlayerLane = this.lanes.right;
				break;
		}
	}

	updatePlayerColliderPosition() {
		this.context.playerCollider.position.x =
			this.context.playerInstance.player.position.x;

		this.context.playerInstance.player.position.y =
			this.context.playerCollider.position.y - 0.6;

		this.context.playerCollider.position.z =
			this.context.playerInstance.player.position.z;

		// this.context.playerCollider.quaternion = new Quaternion(0, 0, 0, 1);
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

function cannonToThreeVec3(cannonvec3) {
	return new THREE.Vector3(
		cannonToThreejsVec3.x,
		cannonToThreejsVec3.y,
		cannonToThreejsVec3.z
	);
}

function threeToCannonVec3(cannonvec3) {
	return new Vec3(
		threeToCannonVec3.x,
		threeToCannonVec3.y,
		threeToCannonVec3.z
	);
}

export { MovementFSM };
