class HealthWorker {
  constructor() {
    addEventListener("message", (event) => {
      this.autoUpdateHealth().bind(this);
    });
  }

  wait(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

  autoUpdateHealth() {
    while (true) {
      this.wait(1.25 * 1000);
      postMessage("");
    }
  }
}

new HealthWorker();
