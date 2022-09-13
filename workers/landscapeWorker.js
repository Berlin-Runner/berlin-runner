class LandscapeWorker {
	constructor() {
		this.landscapeManager = null;
		this.number = 0;

		addEventListener("message", (event) => {
			this.updateLandscape().bind(this);
		});
	}

	wait(ms) {
		const start = Date.now();
		let now = start;
		while (now - start < ms) {
			now = Date.now();
		}
	}

	updateLandscape() {
		// while (true) {
		close();
		this.wait(2 * 1000);
		postMessage("");
		this.updateLandscape();
		// }
	}
}

new LandscapeWorker();
