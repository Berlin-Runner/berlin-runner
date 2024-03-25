class ScoreManager {
	constructor(context) {
		this.context = context
		this.stateManager = this.context.gameStateManager
		this.stateBus = this.context.gameStateEventBus
		this.scoreBus = this.context.scoreEventBus
		this.score = 0
		this.progress = 0
		this.internalProgressCounter = 0 /* for later use */
		this.thresholds = {
			tenReached: false,
			twentyReached: false,
		}

		this.init()
		requestAnimationFrame(this.update.bind(this))
		this.updateScore = true
		this.updateProgress = true
	}

	init() {
		this.setupEventBusSubscriptions()
	}

	setupEventBusSubscriptions() {
		this.stateBus.subscribe("restart_game", () => {
			this.score = 0
			this.progress = 0
			this.internalProgressCounter = 0
			this.scoreBus.publish("level-zero")
		})

		this.stateBus.subscribe("back_to_home", () => {
			this.score = 0
		})

		this.scoreBus.subscribe("add-score", (value) => {
			// if (!this.updateScore) return
			// setTimeout(() => {
			// 	this.updateScore = true
			// }, 10)
			this.score += value
			// this.updateScore = false
			this.context.scoreEventBus.publish("increase-speed", 1 / 60)
			this.scoreBus.publish("update_score", this.formatScore(this.score))
		})

		this.scoreBus.subscribe("add-progress", (value) => {
			if (!this.updateProgress) return
			setTimeout(() => {
				this.updateProgress = true
			}, 1000)

			this.progress += value
			this.internalProgressCounter += value
			console.log(
				"display progress is " +
					this.progress +
					" and the internal counter is at " +
					this.internalProgressCounter
			)
			this.updateProgress = false
			this.scoreBus.publish("update_progress", this.formatScore(this.progress))
			this.checkAndPublishLevelEvent()
		})
	}

	checkAndPublishLevelEvent() {
		if (this.internalProgressCounter >= 10 && !this.thresholds.tenReached) {
			this.progress = 0
			this.scoreBus.publish("update_progress", this.formatScore(this.progress))

			this.scoreBus.publish("level-one")
			this.thresholds.tenReached = true // Prevent future publications for this threshold
		} else if (
			this.internalProgressCounter >= 20 &&
			!this.thresholds.twentyReached
		) {
			this.progress = 0
			this.scoreBus.publish("update_progress", this.formatScore(this.progress))

			this.scoreBus.publish("level-two")
			this.thresholds.twentyReached = true // Prevent future publications for this threshold
		}
	}

	formatScore(score) {
		return Number(score.toFixed(2))
	}

	getScore() {
		return this.formatScore(this.score)
	}

	getProgress() {
		return this.formatScore(this.internalProgressCounter)
	}

	update() {}
}

export { ScoreManager }
