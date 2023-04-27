const LANES = {
	CENTER: "center",
	LEFT: "left",
	RIGHT: "right",
};
export default class MovementManager {
	constructor(context, player) {
		this.context = context;
		this.player = player;
		this._init();
	}

	_init() {
		this.movementEventBus = this.context.playerMovementEventBus;

		this.tweenDuration = 0.45;

		this.currentLane = LANES.CENTER;
		this.moveToLane(LANES.CENTER);
	}

	/* moveObjectToPosition(object, position, duration, finishCallBack) {
		gsap.to(object.position, {
			x: position,
			duration,
			ease: "power4.out",
			onComplete: () => {
				setTimeout(finishCallBack, 500);
			},
		});
	} */

	moveObjectToPosition(object, position, duration, finishCallBack) {
		const startPosition = object.position.x;
		const distance = position - startPosition;
		const startTime = performance.now();
		const easing = (t) => Math.pow(t, 1); // Power4 easing function

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = elapsed / (duration * 1000);

			if (progress < 1) {
				const easedProgress = easing(progress);
				object.position.x = startPosition + distance * easedProgress;
				requestAnimationFrame(animate);
			} else {
				object.position.x = position;
				finishCallBack();
			}
		};

		requestAnimationFrame(animate);
	}

	/* rotateObject(object, angle) {
		gsap.to(object.rotation, {
			y: angle,
			duration: this.tweenDuration / 6,
			// ease: "power4.out",
			onComplete: () => {
				gsap.to(object.rotation, {
					y: Math.PI,
					duration: this.tweenDuration / 2,
				});
			},
		});
	} */

	rotateObject(object, angle) {
		const startAngle = object.rotation.y;
		const angleDifference = angle - startAngle;
		const durationFirstPart = this.tweenDuration / 2;
		const durationSecondPart = this.tweenDuration / 2;
		const startTime = performance.now();

		const easing = (t) => t; // Linear easing function

		const animateFirstPart = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = elapsed / (durationFirstPart * 1000);

			if (progress < 1) {
				const easedProgress = easing(progress);
				object.rotation.y = startAngle + angleDifference * easedProgress;
				requestAnimationFrame(animateFirstPart);
			} else {
				object.rotation.y = angle;
				animateSecondPart(currentTime);
			}
		};

		const animateSecondPart = (currentTime) => {
			const elapsed = currentTime - startTime - durationFirstPart * 1000;
			const progress = elapsed / (durationSecondPart * 1000);

			if (progress < 1) {
				const easedProgress = easing(progress);
				object.rotation.y = angle + (Math.PI - angle) * easedProgress;
				requestAnimationFrame(animateSecondPart);
			} else {
				object.rotation.y = Math.PI;
			}
		};

		requestAnimationFrame(animateFirstPart);
	}

	moveToCenter() {
		this.moveObjectToPosition(this.player, 0, this.tweenDuration, () => {});
		if (this.prevLane == LANES.LEFT)
			this.rotateObject(this.player, Math.PI * 0.75);
		if (this.prevLane == LANES.RIGHT)
			this.rotateObject(this.player, Math.PI * 1.25);
	}

	pullToCenter() {
		this.moveObjectToPosition(this.player, 0, 1);

		if (this.currentPlayerLane == this.lanes.left)
			this.rotateObject(this.player, Math.PI * 0.75);
		if (this.currentPlayerLane == this.lanes.right)
			this.rotateObject(this.player, Math.PI * 1.25);
		this.currentPlayerLane = this.lanes.center;
	}

	moveLeft() {
		this.movementEventBus.publish("player-side-moved");
		this.rotateObject(this.player, Math.PI * 1.25);
		this.moveObjectToPosition(this.player, -2.5, this.tweenDuration, () => {});
	}

	moveRight() {
		this.movementEventBus.publish("player-side-moved");
		this.rotateObject(this.player, Math.PI * 0.75);
		this.moveObjectToPosition(this.player, 2.5, this.tweenDuration, () => {});
	}

	moveToLane(lane) {
		if (lane === this.currentLane) {
			return;
		} else if (
			(lane === "left" && this.currentLane === "right") ||
			(lane === "right" && this.currentLane === "left")
		) {
			this.prevLane = this.currentLane;
			this.currentLane = LANES.CENTER;
			this.updateCharacterPosition();
			return;
		}
		this.currentLane = lane;
		this.updateCharacterPosition();
	}

	updateCharacterPosition() {
		switch (this.currentLane) {
			case "left":
				this.moveLeft();
				break;
			case "center":
				this.moveToCenter();
				break;
			case "right":
				this.moveRight();
				break;
			default:
				break;
		}
	}

	slide() {
		this.movementEventBus.publish("player-slided");
		this.isSliding = true;
		this.context.G.PLAYER_SLIDING = this.isSliding;
		setTimeout(() => {
			this.player.position.y = 0;
			this.isSliding = false;
			this.context.G.PLAYER_SLIDING = this.isSliding;
		}, 1600);

		gsap.to(this.context.gameWorld.camera.position, {
			y: 0.6,
			z: 2.4,
			duration: 0.8,

			onComplete: () =>
				gsap.to(this.context.gameWorld.camera.position, {
					y: 2.2847,
					z: 5.582,
					duration: 0.8,
				}),
		});
	}

	jump() {
		this.movementEventBus.publish("player-jumped");
		this.canJump = true;
		this.context.G.PLAYER_JUMPING = this.canJump;

		gsap.to(this.player.position, {
			y: 3,
			z: 1.75,
			duration: 0.3,

			onComplete: () =>
				gsap.to(this.player.position, {
					y: 0,
					z: 1.5,
					duration: 0.6,
				}),
		});

		setTimeout(() => {
			this.canJump = false;
			this.context.G.PLAYER_JUMPING = this.canJump;
		}, 1810);
	}

	update(delta) {}
}
