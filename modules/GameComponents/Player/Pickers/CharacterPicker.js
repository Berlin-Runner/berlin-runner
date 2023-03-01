import { UTIL } from "../../../Util/UTIL.js";
import AnimationManager from "../AnimationManager.js";
import { Player } from "../Player.js";

export default class CharacterPicker {
	constructor(context) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.scene = this.context.gameWorld.scene;
		this.stateBus = this.context.gameStateEventBus;
		this.stateManager = this.context.gameStateManager;
		this.pickerActive = true;

		this.init();
	}

	init() {
		this.chararcterPickerUI = document.getElementById("character-picker");
		this.chararcterPickerUI.style.display = "none";
		this.characterNameHodler = document.getElementById("character-name");
		this.nextButton = document.getElementById("character-picker-next");
		this.prevButton = document.getElementById("character-picker-prev");
		this.continueButton = document.getElementById("charachter-continue-button");
		this.characterIndex = 0;
		this.totalCharacterCount = 3;

		this.characterNames = ["doctor d", "big ben", "special k"];
		this.characterNameHodler.innerText =
			this.characterNames[this.characterIndex + 1];

		this.setupUIEventListeners();
		this.setupStateEventListeners();
		this.setupPickerArea();

		this.update();
	}

	setupUIEventListeners() {
		this.continueButton.addEventListener("click", () => {
			this.select();
		});

		this.prevButton.addEventListener("click", () => {
			this.prev();
		});

		this.nextButton.addEventListener("click", () => {
			this.next();
		});
	}

	setupStateEventListeners() {
		this.stateBus.subscribe("display-chracter-selector", () => {
			this.start();
		});
	}

	start() {
		this.chararcterPickerUI.style.display = "flex";
	}

	setupPickerArea() {
		// this.camera.position.set(0, 30, -100);
		// this.camera.position.

		this.pickerArea = new THREE.Group();
		this.pickerArea_ = new THREE.Group();
		this.pickerArea.position.set(0, 47.5, -120);
		this.pickerArea_.position.set(0, 47.5, -120);

		// this.camera.lookAt(this.pickerArea.position);

		let geometry = new THREE.PlaneGeometry(100, 100);
		let material = new THREE.MeshStandardMaterial({
			color: 0x3a3a3a,

			side: THREE.DoubleSide,

			transparent: true,
			opacity: 0.99,
		});
		let plane = new THREE.Mesh(geometry, material);
		plane.rotateX(10 * (Math.PI / 180));

		plane.position.y = 15;
		this.pickerArea_.add(plane);

		let ground_geometry = new THREE.PlaneGeometry(100, 100, 64, 64);
		let ground_material = new THREE.MeshStandardMaterial({
			color: new THREE.Color("greenyellow"),
			side: THREE.DoubleSide,
			wireframe: true,
			transparent: true,
			opacity: 0.15,
		});
		let ground_plane = new THREE.Mesh(ground_geometry, ground_material);
		ground_plane.rotateX(110 * (Math.PI / 180));
		ground_plane.position.z = -0.1;
		this.pickerArea_.add(ground_plane);

		this.scene.add(this.pickerArea_);
		this.scene.add(this.pickerArea);

		this.testSphere = new THREE.SphereGeometry(2, 16, 16);
		this.testMat = new THREE.MeshBasicMaterial({
			color: "red",
			wireframe: true,
		});
		this.testMesh = new THREE.Mesh(this.testSphere, this.testMat);

		// this.pickerArea.add(this.testMesh);

		this.addPlayerMeshes();
	}

	async loadBenModel() {
		let { model, animations } = await UTIL.loadModel(
			"/assets/models/zen-ben-v2.glb"
			// "/assets/models/the-girl.glb"
		);

		return { model, animations };
	}

	async loadLadyModel() {
		let { model, animations } = await UTIL.loadModel(
			// "/assets/models/zen-ben.glb"
			// "/assets/models/the-girl.glb"
			"/assets/models/kati.glb"
		);

		return { model, animations };
	}

	async loadCoachModel() {
		let { model, animations } = await UTIL.loadModel(
			// "/assets/models/zen-ben.glb"
			// "/assets/models/the-girl.glb"
			"/assets/models/coach_aabb.glb"
		);

		return { model, animations };
	}

	async addPlayerMeshes() {
		this.ben = await this.loadBenModel();
		this.ben.model.scale.setScalar(190);
		this.pickerArea.add(this.ben.model);

		this.mixer = new THREE.AnimationMixer(this.ben.model);
		this.idleClip = THREE.AnimationClip.findByName(this.ben.animations, "Idle");
		this.idleAction = this.mixer.clipAction(this.idleClip);
		this.idleAction.play();

		this.scene.getObjectByName("aabb").visible = false;
		this.katy = await this.loadLadyModel();
		this.katy.model.scale.setScalar(3.25);
		this.katy.model.position.x = 15;
		this.katy.model.position.z = 0.5;
		this.pickerArea.add(this.katy.model);

		this.mixer_ = new THREE.AnimationMixer(this.katy.model);
		this.idleClip_ = THREE.AnimationClip.findByName(
			this.katy.animations,
			"Idle"
		);
		this.idleAction_ = this.mixer_.clipAction(this.idleClip_);
		this.idleAction_.play();

		this.scene.getObjectByName("aabb").visible = false;
		this.katy.model.traverse((child) => {
			if (child.name === "aabb") child.visible = false;
		});
		this.coach = await this.loadCoachModel();
		this.coach.model.scale.setScalar(1.5);
		this.coach.model.position.x = -15;
		this.coach.model.position.z = 0.5;
		this.pickerArea.add(this.coach.model);
		this.coach.model.traverse((child) => {
			if (child.name === "aabb") child.visible = false;
		});

		this.mixer__ = new THREE.AnimationMixer(this.coach.model);
		this.idleClip__ = THREE.AnimationClip.findByName(
			this.coach.animations,
			"Idle"
		);
		this.idleAction__ = this.mixer__.clipAction(this.idleClip__);
		this.idleAction__.play();

		this.playerModels = [this.coach, this.ben, this.katy];
	}

	next() {
		if (this.characterIndex >= 1) return;
		this.characterIndex += 1;
		// console.log("after next is clicked : " + this.characterIndex);
		gsap.to(this.pickerArea.position, {
			x: -15 * (Math.abs(this.characterIndex) % this.totalCharacterCount),
			duration: 1,
		});
		// gsap.to(this.testMesh.position, { x: 10, duration: 1.5 });
		this.characterNameHodler.innerText =
			this.characterNames[1 + this.characterIndex];
	}

	prev() {
		if (this.characterIndex <= -1) return;
		this.characterIndex -= 1;
		// console.log("after prev is clicked : " + this.characterIndex);
		gsap.to(this.pickerArea.position, {
			x: 15 * (Math.abs(this.characterIndex) % this.totalCharacterCount),
			duration: 1,
		});
		// gsap.to(this.testMesh.position, { x: 0, duration: 1.5 });
		this.characterNameHodler.innerText =
			this.characterNames[1 + this.characterIndex];
	}

	select() {
		this.pickerArea.visible = false;
		this.pickerArea_.visible = false;
		this.stateManager.enterStage();
		this.chararcterPickerUI.style.display = "none";

		// console.log(this.playerModels[this.characterIndex + 1]);
		this.playerModels[this.characterIndex + 1].model.position.set(0, 0, 0);
		this.playerModels[this.characterIndex + 1].model.rotation.set(0, 0, 0);

		this.context.playerInstance = new Player(
			this.context,
			this.playerModels[this.characterIndex + 1]
		);

		this.mixer = null;
		this.mixer_ = null;
		this.mixer__ = null;

		this.pickerActive = false;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		if (!this.pickerActive) return;
		if (this.mixer) this.mixer.update(this.context.time.getDelta());
		if (this.mixer_) this.mixer_.update(this.context.time.getDelta());
		if (this.mixer__) this.mixer__.update(this.context.time.getDelta());
		if (this.ben) this.ben.model.rotation.y += 0.015;
		if (this.katy) this.katy.model.rotation.y += 0.015;
		if (this.coach) this.coach.model.rotation.y += 0.015;
	}
}
