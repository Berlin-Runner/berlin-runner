class World_ {
  constructor(context) {
    this.context = context;
    this.init();
    this.resize();
    this.setupResize();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000.0
    );

    this.camera.position.set(0, 1.5, 4);

    this.scene = new THREE.Scene();
    // this.scene.background = this.context.textures.sky;
    this.scene.background = "#000";

    const near = 0.1;
    const far = 100;
    const color = "#ccc";
    this.scene.fog = new THREE.Fog(color, near, far);

    this.canvas = document.getElementById("webgl");

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvas.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.enabled = false;

    // this.composer = new THREE.EffectComposer(this.renderer);

    let ambLight = new THREE.AmbientLight("#fff", 0.75);
    this.scene.add(ambLight);

    let moonLight = new THREE.DirectionalLight("#fff", 1.75);
    moonLight.position.set(0, 2.5, 0);
    this.scene.add(moonLight);

    /*     this.composer.setSize(window.innerWidth, window.innerHeight);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    const params = {
      shape: 1,
      radius: 1,
      rotateR: Math.PI / 12,
      rotateB: (Math.PI / 12) * 2,
      rotateG: (Math.PI / 12) * 3,
      scatter: 0,
      blending: 0.2,
      blendingMode: 1,
      greyscale: false,
      disable: false,
    };
    const halftonePass = new THREE.HalftonePass(
      window.innerWidth,
      window.innerHeight,
      params
    );

    this.composer.addPass(halftonePass); */
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  update() {
    // if (this.controls.enabled) this.controls.update();
    // this.composer.render();
    this.renderer.render(this.scene, this.camera);
  }
}
