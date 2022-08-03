class ScoreWorker {
  constructor() {
    addEventListener("message", (event) => {
      this.autoUpdateScore().bind(this);
    });
  }

  wait(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

  autoUpdateScore() {
    while (true) {
      this.wait(3 * 1000);
      postMessage("");
    }
  }
}

new ScoreWorker();
