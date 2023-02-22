import { LandscapeTile } from "../../District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeTile.js";
import CharacterPicker from "./CharacterPicker.js";
import { LevelZero } from "../../Levels/LevelZero/LevelZero.js";

export default class DistrictPicker {
	constructor(context) {
		this.context = context;
		this.stateBus = this.context.gameStateEventBus;
		this.camera = this.context.gameWorld.camera;
		this.scene = this.context.gameWorld.scene;

		this.init();
	}

	init() {
		this.pickerUIComponent = document.getElementById("district-picker");
		this.pickerUIComponent.style.display = "none";
		document.getElementById("in-play-screen").style.display = " none";
		this.nextButton = document.getElementById("next-district");
		this.prevButton = document.getElementById("previous-district");
		this.selectButton = document.getElementById("confirm-district-selection");
		this.districtNameHolder = document.getElementById("district-name-holder");

		this.selectedDistrict = this.context.G.SELECTED_DISTRICT;

		this.districtIndex = 0;
		this.totalDistrictCount = 8;

		this.districtNames = [
			"DISTRICT-ONE",
			"DISTRICT-TWO",
			"DISTRICT-THREE",
			"DISTRICT-FOUR",
			"DISTRICT-FIVE",
			"DISTRICT-SIX",
			"DISTRICT-SEVEN",
		];

		this.districtNameHolder.innerText =
			this.districtNames[this.selectedDistrict];
		/*
                move camera to 0 , 20 , 0

                create a 3d object that will be container for all the district tiles

                add the tiles

                implement a next/prev and select functionality
            */

		this.setupPickerArea();

		this.setupUIEventListeners();
		this.setupStateEventListeners();

		this.context.characterPicker = new CharacterPicker(this.context);
	}

	setupUIEventListeners() {
		this.nextButton.addEventListener("click", () => {
			this.next();
		});
		this.prevButton.addEventListener("click", () => {
			this.prev();
		});
		this.selectButton.addEventListener("click", () => {
			this.select();
		});
	}

	setupStateEventListeners() {
		this.stateBus.subscribe("pick-district", () => {
			this.pickerUIComponent.style.display = "flex";
		});
	}

	async setupPickerArea() {
		this.camera.position.set(0, 55, -7.5);

		this.pickerArea = new THREE.Group();
		this.pickerArea_ = new THREE.Group();
		this.pickerArea.position.set(0, 50, 0);
		this.pickerArea_.position.set(0, 50, 0);

		this.camera.lookAt(this.pickerArea.position);

		let geometry = new THREE.PlaneGeometry(100, 100);
		let material = new THREE.MeshStandardMaterial({
			color: 0x3a3a3a,

			side: THREE.DoubleSide,

			transparent: true,
			opacity: 0.99,
		});
		let plane = new THREE.Mesh(geometry, material);
		plane.rotateX(30 * (Math.PI / 180));

		plane.position.y = -20;

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

		this.testSphere = new THREE.SphereGeometry(2, 16, 16);
		this.testMat = new THREE.MeshBasicMaterial({
			color: "red",
			wireframe: true,
		});

		this.testMat2 = new THREE.MeshBasicMaterial({
			color: "green",
			wireframe: true,
		});

		this.testMat3 = new THREE.MeshBasicMaterial({
			color: "pink",
			wireframe: true,
		});

		this.testMat4 = new THREE.MeshBasicMaterial({
			color: "yellow",
			wireframe: true,
		});

		this.testMat5 = new THREE.MeshBasicMaterial({
			color: "indigo",
			wireframe: true,
		});

		this.testMesh = new THREE.Mesh(this.testSphere, this.testMat);
		this.testMesh2 = new THREE.Mesh(this.testSphere, this.testMat2);
		this.testMesh3 = new THREE.Mesh(this.testSphere, this.testMat3);
		this.testMesh4 = new THREE.Mesh(this.testSphere, this.testMat4);
		this.testMesh5 = new THREE.Mesh(this.testSphere, this.testMat5);
		this.testMesh.position.set(10, 0, -2);
		this.testMesh2.position.set(0, 0, -2);
		this.testMesh3.position.set(-10, 0, -2);
		this.testMesh4.position.set(-20, 0, -2);
		this.testMesh5.position.set(20, 0, -2);

		this.disrtictsHolder = new THREE.Group();

		this.pickerArea.add(this.disrtictsHolder);

		this.scene.add(this.pickerArea);
		this.scene.add(this.pickerArea_);

		await this.addTiles();
	}

	async addTiles() {
		this.tileOne = await new LandscapeTile("assets/models/tiles/tiles.1.2.glb");
		this.context.tileOne = this.tileOne;
		this.tileTwo = await new LandscapeTile("assets/models/tiles/tiles.2.3.glb");
		this.context.tileTwo = this.tileTwo;
		this.tileThree = await new LandscapeTile(
			"assets/models/tiles/tiles.3.2.glb"
		);
		this.context.tileThree = this.tileThree;
		this.tileFour = await new LandscapeTile("assets/models/tiles/tiles.4.glb");
		this.context.tileFour = this.tileFour;
		this.tileFive = await new LandscapeTile("assets/models/tiles/tiles.5.glb");
		this.context.tileFive = this.tileFive;
		this.tileSix = await new LandscapeTile("assets/models/tiles/tiles.6.3.glb");
		this.context.tileSix = this.tileSix;
		this.tileSeven = await new LandscapeTile("assets/models/tiles/tiles.7.glb");
		this.context.tileSeven = this.tileSeven;

		this.tileEight = await new LandscapeTile("assets/models/tiles/tiles.8.glb");
		this.context.tileEight = this.tileEight;

		this.tiles = [
			this.tileOne,
			this.tileTwo,
			this.tileThree,
			this.tileFour,
			this.tileFive,
			this.tileSix,
			this.tileSeven,
			this.tileEight,
		];

		this.tiles.forEach((tile, index) => {
			tile.position.x = -30 + 10 * index;
			tile.scale.setScalar(0.15);
			tile.rotateY(180 * (Math.PI / 180));
			tile.rotateX(-20 * (Math.PI / 180));
			this.disrtictsHolder.add(tile);
		});

		// this.tileOne.scale.setScalar(0.2);
		// this.tileOne.rotateX(-10 * (Math.PI / 180));
		// this.disrtictsHolder.add(this.tileOne);
	}

	next() {
		if (this.districtIndex >= 4) return;
		this.districtIndex += 1;
		console.log("after next is clicked : " + this.districtIndex);
		gsap.to(this.pickerArea.position, {
			x: 10 * (this.districtIndex % this.totalDistrictCount),
			duration: 1,
		});
		// gsap.to(this.testMesh.position, { x: 10, duration: 1.5 });
		this.districtNameHolder.innerText =
			this.districtNames[3 + this.districtIndex];
	}

	prev() {
		if (this.districtIndex <= -4) return;
		this.districtIndex -= 1;
		console.log("after prev is clicked : " + this.districtIndex);
		gsap.to(this.pickerArea.position, {
			x: 10 * (this.districtIndex % this.totalDistrictCount),
			duration: 1,
		});
		// gsap.to(this.testMesh.position, { x: 0, duration: 1.5 });
		this.districtNameHolder.innerText =
			this.districtNames[3 + this.districtIndex];
	}

	select() {
		this.pickerArea.visible = false;
		this.pickerArea_.visible = false;
		this.pickerUIComponent.style.display = "none";
		this.context.G.SELECTED_DISTRICT = this.districtIndex + 3;
		// this.camera.lookAt(this.context.playerInstance.player.position);
		gsap.to(this.camera.position, {
			x: 0,
			y: 50,
			z: -110,
			duration: 0.75,
		});
		gsap.to(this.camera.rotation, { x: 0, y: 0, z: 0, duration: 0.75 });

		this.stateBus.publish("display-chracter-selector");
		this.initLevels();
	}

	initLevels() {
		this.tiles.forEach((tile, index) => {
			tile.position.z = 0;
			tile.position.x = 0;
			tile.position.y = -0.1;
			// tile.position.z += this.context.G.TILE_LENGTH * index;
			tile.scale.setScalar(1);
			tile.rotation.set(0, 0, 0);
			// this.disrtictsHolder.add(tile);
		});
		this.context.levelZero = new LevelZero(this.context);
		this.context.levelZero.activeLevel = true;

		this.context.currentLevel = this.context.levelZero;
	}
}
