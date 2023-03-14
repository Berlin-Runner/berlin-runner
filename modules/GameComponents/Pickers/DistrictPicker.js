import { LandscapeTile } from "../District/DistrictComponents/LandscapeSystem/LandscapeTiles/LandscapeTile.js";
import CharacterPicker from "./CharacterPicker.js";
import { LevelZero } from "../Levels/LevelZero/LevelZero.js";

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
		this.totalDistrictCount = 7;

		/*
		1 - "goerlitzer park"
		2 -" kottbusser tor"
		3 - "oberbaumbruecke"
		4 - "runbase"
		5 - "braves hq"
		6 - "schlesisches tor"
		7 - "alexanderplatz"
		*/

		this.districtNames = [
			"goerlitzer park",
			" kottbusser tor",
			"oberbaumbruecke",
			"runbase",
			"braves hq",
			"schlesisches tor",
			"alexanderplatz",
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

		this.disrtictsHolder = new THREE.Group();

		this.pickerArea.add(this.disrtictsHolder);

		this.scene.add(this.pickerArea);
		this.scene.add(this.pickerArea_);

		this.addTiles();
	}

	addTiles() {
		this.tiles = [
			this.context.tileOne,
			this.context.tileTwo,
			this.context.tileThree,
			this.context.tileFour,
			this.context.tileFive,
			this.context.tileSix,
			this.context.tileSeven,
		];

		// console.log(this.tiles);

		this.tiles.forEach((tile, index) => {
			tile.position.x = -30 + 10 * index;
			tile.scale.setScalar(0.15);
			tile.rotateY(180 * (Math.PI / 180));
			tile.rotateX(-20 * (Math.PI / 180));
			this.disrtictsHolder.add(tile);
		});
	}

	next() {
		if (this.districtIndex >= 3) return;
		this.districtIndex += 1;
		console.log("after next is clicked : " + this.districtIndex);
		gsap.to(this.pickerArea.position, {
			x: 10 * (this.districtIndex % this.totalDistrictCount),
			duration: 1,
		});

		this.districtNameHolder.innerText =
			this.districtNames[3 + this.districtIndex];
	}

	prev() {
		if (this.districtIndex <= -3) return;
		this.districtIndex -= 1;
		console.log("after prev is clicked : " + this.districtIndex);
		gsap.to(this.pickerArea.position, {
			x: 10 * (this.districtIndex % this.totalDistrictCount),
			duration: 1,
		});
		this.districtNameHolder.innerText =
			this.districtNames[3 + this.districtIndex];
	}

	select() {
		this.pickerArea.visible = false;
		this.pickerArea_.visible = false;
		this.pickerUIComponent.style.display = "none";
		this.context.G.SELECTED_DISTRICT = this.districtIndex + 3;

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
			tile.scale.setScalar(1);
			tile.rotation.set(0, 0, 0);
		});
		this.context.levelZero = new LevelZero(this.context);
		this.context.levelZero.activeLevel = true;

		this.context.currentLevel = this.context.levelZero;
	}
}
