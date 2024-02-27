import { BaseUIComponent } from "../BaseUIComponent.js"
import { ExplosiveElement } from "../ExplosiveButton.js"

class GamePlayComponent extends BaseUIComponent {
	constructor(id, context) {
		super(id, context)

		this.pauseButton = new BaseUIComponent("pause-button", this.context)
		this.scoreHolder = document.getElementById("score_text")
		this.progressHolder = document.getElementById("progress_text")
		this.progressBar = document.getElementById("progressBar")
		this.incrementValue(0)
		this.explosiveProgressBar = new ExplosiveElement("progress-holder")

		this.healthValueHolder = document.getElementById("health-value")

		this.setUpComponentEventListners()
		this.setupEventBusSubscriptions()
	}

	incrementValue(value) {
		if (value < 10) {
			progressBar.style.width = `${value * 10}%` // Update width based on value
		}
	}

	setUpComponentEventListners() {
		this.pauseButton.listenToEvent("click", () => {
			this.pauseGame()
		})
	}

	setupEventBusSubscriptions() {
		this.scoreBus.subscribe("update_score", (score) => {
			this.upadteScore(score)
		})

		this.scoreBus.subscribe("update_progress", (value) => {
			this.upadteProgress(value)
			this.incrementValue(value)
		})

		this.context.scoreEventBus.subscribe("level-one", () => {
			this.explosiveProgressBar.runExplosion()
		})

		this.context.scoreEventBus.subscribe("level-two", () => {
			this.explosiveProgressBar.runExplosion()
		})

		this.healthBus.subscribe("update_health", (health) => {
			this.updateHealth(health)
		})

		this.stateBus.subscribe("pause_game", () => {
			this.pauseButton.hideComponent()
		})

		this.stateBus.subscribe("resume_game", () => {
			this.pauseButton.showComponent()
		})

		this.stateBus.subscribe("restart_game", () => {
			this.pauseButton.showComponent()
			this.scoreHolder.innerText = "0"
			this.progressHolder.innerText = "0"
			this.incrementValue(0)
			this.healthValueHolder.innerText = "=)"
		})
	}

	pauseGame() {
		console.log("pausing the game")
		this.stateManager.pauseGame()
	}

	upadteScore(score) {
		this.scoreHolder.innerText = score
		gsap.to(this.scoreHolder.style, {
			fontSize: "136px",
			duration: 0.125,
			onComplete: () => {
				gsap.to(this.scoreHolder.style, { fontSize: "60px", duration: 0.1 })
			},
		})
	}

	upadteProgress(value) {
		this.progressHolder.innerText = value
		gsap.to(this.progressHolder.style, {
			fontSize: "136px",
			duration: 0.125,
			onComplete: () => {
				gsap.to(this.progressHolder.style, { fontSize: "60px", duration: 0.1 })
			},
		})
	}

	updateHealth(health) {
		this.healthValueHolder.innerText = health
	}
}

export { GamePlayComponent }
