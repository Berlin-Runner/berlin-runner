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
			95,
			window.innerWidth / window.innerHeight,
			0.1,
			100000.0
		);
	}

	initScene() {
		this.scene = new THREE.Scene();
		this.scene.background = this.context.textures.sky;
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
		let ambLight = new THREE.AmbientLight("#ffffff", 2);
		this.scene.add(ambLight);

		let sunlight = new THREE.DirectionalLight(0xffffff, 1);

		// Set the position of the light to simulate the sun's position
		sunlight.position.set(0, 1, 1);

		// Set the color of the light to a warm yellow tone
		sunlight.color.setHex(0xf9d71c);

		// Set the intensity of the light to simulate the brightness of the sun
		sunlight.intensity = 0.75;

		// Set the castShadow property to true to enable shadows
		sunlight.castShadow = true;

		// Set the shadow properties to improve the quality of the shadows
		sunlight.shadow.mapSize.width = 1024;
		sunlight.shadow.mapSize.height = 1024;
		sunlight.shadow.camera.near = 0.1;
		sunlight.shadow.camera.far = 1000;
		sunlight.shadow.camera.left = -500;
		sunlight.shadow.camera.right = 500;
		sunlight.shadow.camera.top = 500;
		sunlight.shadow.camera.bottom = -500;

		// Add the light to the scene
		this.scene.add(sunlight);
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
