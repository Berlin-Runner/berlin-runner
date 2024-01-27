import InputManager from "./InputManager.js"
import { Camera3rdPerson } from "./Camera3rdPerson.js"

export default class PlayerController {
	constructor(context, player) {
		this.context = context
		this.player = player

		this.settings = {
			cameraFollow: false,
		}

		this.inputManager = new InputManager(this.context, this.player)
		this.thirdPersonCamera = new Camera3rdPerson(this.context, this.player)

		this.setupEventSubscriptions()
		this.addClassSettings()
		this.update()
	}

	setupEventSubscriptions() {
		this.context.gameStateEventBus.subscribe(
			"enter_play",
			() => (this.settings.cameraFollow = true)
		)
	}

	update() {
		if (this.settings.cameraFollow) {
			this.thirdPersonCamera.update()
		}
	}

	addClassSettings() {}
}
