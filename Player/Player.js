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
    this.setupPlayerMovementKeyListners();
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

  setupPlayerMovementKeyListners() {
    window.addEventListener("keypress", (e) => {
      if (!this.player) return;
      switch (e.code) {
        case "KeyA":
          gsap.to(this.player.position, { x: -2, duration: 0.5 });
          break;

        case "KeyD":
          gsap.to(this.player.position, { x: 2, duration: 0.5 });
          break;

        case "KeyS":
          gsap.to(this.player.position, { x: 0, duration: 0.5 });
          break;

        default:
          break;
      }
    });
  }

  jumpPlayer() {
    let vAngle = 0;
    vAngle += speed;
    player.position.y = Math.sin(vAngle) + 1.38;
  }

  setupJumpListner() {
    window.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        this.jumpPlayer(0.05);
      }
    });
  }

  updateCamera() {
    if (!this.camera || !this.player) return;
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + 1.125;
    this.camera.position.z = this.player.position.z + 4.5;
    this.camera.lookAt(this.player.position);
  }

  update() {
    /* 
    // commented out the enable handsfree mode 
    if (this.player) this.player.position.z -= 0.125;
    this.updateCamera(); */
    if (this.mixer) this.mixer.update(this.context.time.getDelta());
  }
}
