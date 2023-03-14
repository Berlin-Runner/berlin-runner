import BusTutorial from "./BusTutorial.js";
import BridgeTutorial from "./BridgeTutorial.js";
import RiverTutorial from "./RiverTutorial.js";

export default class TutorialManager {
	constructor(context) {
		this.context = context;

		this.init();
	}

	init() {
		this.riverTutorial = new RiverTutorial(this.context);
		this.bridgeTutorial = new BridgeTutorial(this.context);
		this.busTutorial = new BusTutorial(this.context);
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		this.riverTutorial.update();
		this.bridgeTutorial.update();
		this.busTutorial.update();
	}
}
