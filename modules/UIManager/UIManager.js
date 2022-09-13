import { GameIntroComponent } from "./CommonUIComponents/GameIntroComponent.js";
import { GamePlayComponent } from "./CommonUIComponents/GamePlayComponent.js";
import { GamePausedComponent } from "./CommonUIComponents/GamePausedComponent.js";
import { GameOverComponent } from "./CommonUIComponents/GameOverComponent.js";
class UIManager {
	constructor(context) {
		this.context = context;
		console.log("UI manager has woken up");
		this.setupUIComponents();
	}

	setupUIComponents() {
		console.log("Setting up UI components");
		this.gameIntroComponent = new GameIntroComponent(
			"intro-screen",
			this.context
		);
		this.gameIntroComponent.showComponent();
		this.gameIntroComponent.showStatic();

		this.gamePlayComponent = new GamePlayComponent(
			"in-play-screen",
			this.context
		);

		this.gamePlayComponent.showComponent();
		this.gamePlayComponent.showStatic();

		this.gamePausedComponent = new GamePausedComponent(
			"paused-screen",
			this.context
		);
		this.gamePausedComponent.hideComponent();

		this.gameOverComponent = new GameOverComponent(
			"game-over-screen",
			this.context
		);
		this.gameOverComponent.hideComponent();
	}
}

export { UIManager };
