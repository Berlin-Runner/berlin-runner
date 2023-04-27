import InputManager from "./InputManager.js";

export default class PlayerController {
	constructor(context, player) {
		this.context = context;
		this.player = player;

		this.inputManager = new InputManager(this.context, this.player);

		this.addClassSettings();
	}

	update() {}

	addClassSettings() {}
}
