class World_ {
	constructor(context) {
		this.context = context;
		this.init();
		this.resize();
		this.setupResize();
		this.addClassSettings();
	}

	init() {
		this.camera = new THREE.PerspectiveCamera(
			80,
			window.innerWidth / window.innerHeight,
			0.1,
			1000.0
		);
		// this.camera.position.set(0, 4.5, 7);

		this.scene = new THREE.Scene();
		this.scene.background = this.context.textures.sky;

		/* const near = 0.1;
		const far = 125;
		const color = "#ccc";
		this.scene.fog = new THREE.Fog(color, near, far); */

		this.canvas = document.getElementById("webgl");

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		});

		/* let pixelRatio = window.devicePixelRatio;
		let AA = true;
		if (pixelRatio > 1) {
			AA = false;
		} */

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio * 0.5);

		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.canvas.appendChild(this.renderer.domElement);

		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enabled = false;

		let ambLight = new THREE.AmbientLight("#ddd", 0.75);
		this.scene.add(ambLight);

		/* let hemiLight = new THREE.HemisphereLight(0xfff, 0xfff, 2);
		this.scene.add(hemiLight); */

		let sunLight = new THREE.DirectionalLight("#fff", 1);
		sunLight.position.set(0, 1.5, 1);
		this.scene.add(sunLight);
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
