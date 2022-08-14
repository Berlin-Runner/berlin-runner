class Player {
  constructor(context) {
    this.context = context;
    this.camera = this.context.gameWorld.camera;
    this.scene = this.context.gameWorld.scene;

    this.runAction = null;
    this.stopAction = null;
    this.deadAction = null;
    this.runClip = null;
    this.haltClip = null;
    this.deadClip = null;
    this.mixer = null;

    this.player = null;

    this.init();
  }

  init() {
    this.addPlayerMesh();
    this.thirdPersonCamera = new Camer3rdPerson(this.context, this.player);
    this.cameraFollow = true;
    this.movementManager = new MovementFSM(this.context, this.player);
  }

  async loadPlayerModel() {
    let { model, animations } = await UTIL.loadModel(
      "/assets/models/coach.glb"
    );

    return { model, animations };
  }

  async addPlayerMesh() {
    this.player = new THREE.Group();
    let playerModelFull = await this.loadPlayerModel();

    let playerMesh = playerModelFull.model;
    let playerAnimation = playerModelFull.animations;

    this.mixer = new THREE.AnimationMixer(playerMesh);
    let clips = playerAnimation;

    this.player.add(playerMesh);
    this.player.rotation.set(0, Math.PI, 0);
    this.player.scale.setScalar(0.25);

    this.player.addEventListener("collide", () => {
      "THE PLAYER HAS COLLIDED";
    });

    this.runClip = THREE.AnimationClip.findByName(clips, "RUN");
    this.haltClip = THREE.AnimationClip.findByName(clips, "SALSA");
    this.deadClip = THREE.AnimationClip.findByName(clips, "SALSA");

    if (this.mixer) {
      this.runAction = this.mixer.clipAction(this.runClip);
      this.stopAction = this.mixer.clipAction(this.haltClip);
      this.deadAction = this.mixer.clipAction(this.deadClip);
    }

    this.deadAction.setLoop(THREE.LoopOnce);
    this.runAction.play();

    this.scene.add(this.player);
  }

  update() {
    if (this.cameraFollow) this.thirdPersonCamera.update();
    if (this.mixer) this.mixer.update(this.context.time.getDelta());
    if (this.movementManager) this.movementManager.update();
  }
}
