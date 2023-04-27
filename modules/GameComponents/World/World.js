class World_ {
	constructor(context) {
		this.context = context;
		this.init();
		this.resize();
		this.setupResize();
		this.addClassSettings();
	}

	init() {
		this.initCamera();

		this.initScene();

		this.initRenderer();

		this.initControls();

		this.initLights();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			0.1,
			100000.0
		);
	}

	initScene() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color("#87CEFA");
	}

	initRenderer() {
		this.canvas = document.getElementById("webgl");

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio * 0.5);

		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.physicallyCorrectLights = true;
		this.canvas.appendChild(this.renderer.domElement);
	}

	initControls() {
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enabled = false;
	}

	initLights() {
		let ambLight = new THREE.AmbientLight("#ffffff", 0.75);
		this.scene.add(ambLight);

		let sunlight = new THREE.DirectionalLight(0xffffff, 1.5);
		let sunlight_ = new THREE.DirectionalLight(0xffffff, 1.5);

		// Set the position of the light to simulate the sun's position
		sunlight.position.set(10, 5, 5);
		sunlight_.position.set(10, 10, -10);

		// Set the color of the light to a warm yellow tone
		// sunlight.color.setHex(0xf9d71c);

		// Set the intensity of the light to simulate the brightness of the sun

		sunlight.castShadow = true;
		sunlight_.castShadow = true;

		sunlight.shadow.mapSize.width = 1024;
		sunlight.shadow.mapSize.height = 1024;

		sunlight.shadow.camera.near = 500;
		sunlight.shadow.camera.far = 4000;
		sunlight.shadow.camera.fov = 30;

		// Add the light to the scene
		this.scene.add(sunlight, sunlight_);
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
		if (this.controls.enabled) this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("WORLD SETTINGS");

		this.localSettings
			.add(this.controls, "enabled")
			.onChange((value) => {
				this.controls.enabled = value;
				this.context.settingEventBus.publish("go-hands-free", value);
			})
			.name("hands-free");

		this.localSettings.open();
	}
}

export { World_ };
