class City {
  constructor(context, opts) {
    this.context = context;
    this.opts = opts;
    this.name = this.opts.name;

    console.log(`${this.name} has woken up `);

    this.awake();
  }

  awake() {
    this.landscapeManager = new LandscapeGenerationManager(this.context, {
      tiles: this.opts.tiles,
    });

    this.landscapeWorker = new Worker("../Workers/landscapeWorker.js");

    this.start();
  }

  start() {
    this.landscapeWorker.postMessage({});

    this.landscapeWorker.onmessage = () => {
      this.landscapeManager.update();
    };
  }

  dispose() {
    this.landscapeManager.dispose();
  }

  update() {
    this.landscapeManager.updateCityMeshPoistion();
  }
}
