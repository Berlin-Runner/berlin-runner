import { UTIL } from "../../Util/UTIL.js";
import { Player } from "../Player/Player.js";

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
		this.totalCharacterCount = 4;

		this.characterIndex = 0;
		this.gapDistance = 15;

		this.characterNames = [
			"big ben",
			"special k",
			"doctor d",
			"captain bubbles",
		];
		this.characterNameHodler.innerText =
			this.characterNames[this.characterIndex];

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
		this.pickerArea = new THREE.Group();
		this.pickerArea_ = new THREE.Group();
		this.pickerArea.position.set(0, 47.5, -120);
		this.pickerArea_.position.set(0, 47.5, -120);

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

		this.addPlayerMeshes();
	}

	async addPlayerMeshes() {
		this.context.ben.model.scale.setScalar(190);
		this.pickerArea.add(this.context.ben.model);

		this.mixer = new THREE.AnimationMixer(this.context.ben.model);
		this.idleClip = THREE.AnimationClip.findByName(
			this.context.ben.animations,
			"Idle"
		);
		this.idleAction = this.mixer.clipAction(this.idleClip);
		this.idleAction.play();

		this.scene.getObjectByName("aabb").visible = false;

		this.context.katy.model.scale.setScalar(3.25);
		this.context.katy.model.position.x = 15;
		this.context.katy.model.position.z = 0.5;
		this.pickerArea.add(this.context.katy.model);

		this.mixer_ = new THREE.AnimationMixer(this.context.katy.model);
		this.idleClip_ = THREE.AnimationClip.findByName(
			this.context.katy.animations,
			"Idle"
		);
		this.idleAction_ = this.mixer_.clipAction(this.idleClip_);
		this.idleAction_.play();

		this.scene.getObjectByName("aabb").visible = false;
		this.context.katy.model.traverse((child) => {
			if (child.name === "aabb") child.visible = false;
		});

		this.context.captain.model.scale.setScalar(200);
		this.context.captain.model.position.x = 45;
		this.context.captain.model.traverse((child) => {
			if (child.name === "aabb") child.visible = false;
		});
		this.pickerArea.add(this.context.captain.model);

		this.mixer___ = new THREE.AnimationMixer(this.context.captain.model);
		this.idleClip___ = THREE.AnimationClip.findByName(
			this.context.captain.animations,
			"Idle"
		);
		this.idleAction___ = this.mixer___.clipAction(this.idleClip___);
		this.idleAction___.play();

		this.context.coach.model.scale.setScalar(1.5);
		this.context.coach.model.position.x = 30;
		this.context.coach.model.position.z = 0.5;
		this.pickerArea.add(this.context.coach.model);
		this.context.coach.model.traverse((child) => {
			if (child.name === "aabb") child.visible = false;
		});

		this.mixer__ = new THREE.AnimationMixer(this.context.coach.model);
		this.idleClip__ = THREE.AnimationClip.findByName(
			this.context.coach.animations,
			"Idle"
		);
		this.idleAction__ = this.mixer__.clipAction(this.idleClip__);
		this.idleAction__.play();

		this.playerModels = [
			this.context.ben,
			this.context.katy,
			this.context.coach,
			this.context.captain,
		];
	}

	next() {
		if (this.characterIndex >= 3) return;
		this.characterIndex += 1;
		gsap.to(this.pickerArea.position, {
			x: -15 * (this.characterIndex % this.totalCharacterCount),
			duration: 1,
		});
		this.characterNameHodler.innerText =
			this.characterNames[this.characterIndex];
	}

	prev() {
		if (this.characterIndex < 1) return;
		this.characterIndex -= 1;
		gsap.to(this.pickerArea.position, {
			x: -15 * (this.characterIndex % this.totalCharacterCount),
			duration: 1,
		});
		this.characterNameHodler.innerText =
			this.characterNames[this.characterIndex];
	}

	select() {
		this.pickerArea.visible = false;
		this.pickerArea_.visible = false;
		this.stateManager.enterStage();
		this.chararcterPickerUI.style.display = "none";

		this.playerModels[this.characterIndex].model.position.set(0, 0, 0);
		this.playerModels[this.characterIndex].model.rotation.set(0, 0, 0);

		this.context.playerInstance = new Player(
			this.context,
			this.playerModels[this.characterIndex]
		);

		// this.playerModels[]
		console.log(this.characterIndex);

		this.mixer = null;
		this.mixer_ = null;
		this.mixer__ = null;
		this.mixer___ = null;

		this.pickerActive = false;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		if (!this.pickerActive) return;
		if (this.mixer) this.mixer.update(this.context.time.getDelta());
		if (this.mixer_) this.mixer_.update(this.context.time.getDelta());
		if (this.mixer__) this.mixer__.update(this.context.time.getDelta());
		if (this.mixer___) this.mixer___.update(this.context.time.getDelta());
		if (this.context.ben) this.context.ben.model.rotation.y += 0.015;
		if (this.context.katy) this.context.katy.model.rotation.y += 0.015;
		if (this.context.coach) this.context.coach.model.rotation.y += 0.015;
		if (this.context.captain) this.context.captain.model.rotation.y += 0.015;

		if (this.characterIndex == 0) {
			this.prevButton.style.display = "none";
		} else {
			this.prevButton.style.display = "flex";
		}

		if (this.characterIndex == 3) {
			console.log("=)");
			this.nextButton.style.display = "none";
		} else {
			this.nextButton.style.display = "flex";
		}
	}
}
