import MovementManager from "./MovementManager.js";
import AnimationManager from "./AnimationManager.js";

const KEY_CODES = {
	LEFT: "KeyA",
	RIGHT: "KeyD",
	JUMP: "Space",
	SLIDE: "KeyS",
};

const LANES = {
	CENTER: "center",
	LEFT: "left",
	RIGHT: "right",
};

export default class InputManager {
	constructor(context, player) {
		this.context = context;
		this.player = player;
		this.movementManager = new MovementManager(this.context, this.player);
		this.animationManager = new AnimationManager(this.context);

		this.keyStates = {
			left: false,
			right: false,
			jump: false,
			slide: false,
		};

		this.initKeyboardListeners();
		this.initSwipeListeners();
	}

	left() {
		this.keyStates.left = true;
		this.movementManager.moveToLane(LANES.LEFT);
	}
	right() {
		this.keyStates.right = true;
		this.movementManager.moveToLane(LANES.RIGHT);
	}
	up() {
		this.keyStates.jump = true;
		this.movementManager.jump();
		this.animationManager.playJumpAnimation();
	}
	down() {
		this.keyStates.slide = true;
		this.movementManager.slide();
		this.animationManager.playSlideAnimation();
	}

	initKeyboardListeners() {
		document.addEventListener("keydown", (event) => {
			if (event.code === KEY_CODES.LEFT && !this.keyStates.left) {
				this.left();
			} else if (event.code === KEY_CODES.RIGHT && !this.keyStates.right) {
				this.right();
			} else if (event.code === KEY_CODES.JUMP && !this.keyStates.jump) {
				this.up();
			} else if (event.code === KEY_CODES.SLIDE && !this.keyStates.slide) {
				this.down();
			}
		});

		document.addEventListener("keyup", (event) => {
			if (event.code === KEY_CODES.LEFT) {
				this.keyStates.left = false;
			} else if (event.code === KEY_CODES.RIGHT) {
				this.keyStates.right = false;
			} else if (event.code === KEY_CODES.JUMP) {
				this.keyStates.jump = false;
			} else if (event.code === KEY_CODES.SLIDE) {
				this.keyStates.slide = false;
			}
		});
	}

	initSwipeListeners() {
		const hammertime = new Hammer(document.getElementById("webgl"), {});

		hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

		hammertime.on("swipeleft", (e) => {
			this.left();
			setTimeout(() => {
				this.keyStates.left = false;
			}, 100);
		});

		hammertime.on("swiperight", (e) => {
			this.right();
			setTimeout(() => {
				this.keyStates.right = false;
			}, 100);
		});

		hammertime.on("swipedown", (e) => {
			this.down();
			setTimeout(() => {
				this.keyStates.slide = false;
			}, 100);
		});

		hammertime.on("swipeup", (e) => {
			this.up();
			setTimeout(() => {
				this.keyStates.jump = false;
			}, 100);
		});
	}

	isKeyDown(key) {
		return this.keysDown[key];
	}
}
