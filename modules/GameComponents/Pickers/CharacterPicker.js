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
		document.getElementById("in-play-screen").style.display = " none";
		this.chararcterPickerUI = document.getElementById("character-picker");
		this.chararcterPickerUI.style.display = "none";
		this.characterNameHodler = document.getElementById("character-name");
		this.nextButton = document.getElementById("character-picker-next");
		this.prevButton = document.getElementById("character-picker-prev");
		this.continueButton = document.getElementById("charachter-continue-button");
		this.totalCharacterCount = 5;

		this.characterIndex = 0;
		this.gapDistance = 15;

		this.characterNames = [
			"berlin bouncer",
			"captain bubbles",
			"doctor d",
			"special k",
			"big ben",
		];
		this.characterNameHodler.innerText =
			this.characterNames[this.characterIndex];

		this.setupUIEventListeners();
		this.listenForSwipeInputs();
		this.setupStateEventListeners();
		this.setupPickerArea();

		this.update();
	}

	listenForSwipeInputs() {
		let hammertime = new Hammer(
			document.getElementById("character-picker"),
			{}
		);

		hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

		hammertime.on("swipeleft", (e) => {
			this.next();
		});

		hammertime.on("swiperight", (e) => {
			this.prev();
		});
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

			// if (this.bouncerWorldPos && this.context.bouncer.model)
			// 	this.context.player.position.set(
			// 		this.bouncerWorldPos.x,
			// 		this.bouncerWorldPos.y,
			// 		this.bouncerWorldPos.z
			// 	);
			// console.log(this.context.bouncer.model.position);
		});
	}

	start() {
		this.chararcterPickerUI.style.display = "flex";
		this.pickerArea.visible = true;
		this.pickerArea_.visible = true;

		this.pickerActive = true;
	}

	setupPickerArea() {
		let debugObject = {};
		debugObject.depthColor = "#aaa";
		debugObject.surfaceColor = "#ccc";

		this.pickerArea = new THREE.Group();
		this.pickerArea_ = new THREE.Group();
		this.pickerArea.position.set(0, 47.5, -120);
		this.pickerArea_.position.set(0, 47.5, -120);

		let geometry = new THREE.PlaneGeometry(100, 100, 512, 512);
		let material = new THREE.MeshStandardMaterial({
			color: "#222",

			side: THREE.DoubleSide,

			transparent: true,
			opacity: 0.99,
		});

		let plane = new THREE.Mesh(geometry, material);
		plane.rotateX(10 * (Math.PI / 180));

		plane.position.y = 15;
		this.pickerArea_.add(plane);

		let ground_geometry = new THREE.PlaneGeometry(100, 50, 512, 512);
		// let ground_material = new THREE.MeshStandardMaterial({
		// 	color: new THREE.Color("greenyellow"),
		// 	side: THREE.DoubleSide,
		// 	wireframe: true,
		// 	transparent: true,
		// 	opacity: 0.15,
		// });

		this.ground_material = new THREE.ShaderMaterial({
			wireframe: true,
			uniforms: {
				uTime: {
					value: 0,
				},

				uBigWavesElevation: {
					value: 0.005,
				},
				uBigWavesFrequency: {
					value: new THREE.Vector2(0, 0),
				},
				uBigWavesSpeed: {
					value: 0.5,
				},

				uSmallWavesElevation: {
					value: 0.5,
				},
				uSmallWavesFrequency: {
					value: 0.5,
				},
				uSmallWavesSpeed: {
					value: 0.05,
				},
				uSmallWavesIteration: {
					value: 3,
				},

				uDepthColor: {
					value: new THREE.Color(debugObject.depthColor),
				},
				uSurfaceColor: {
					value: new THREE.Color(debugObject.surfaceColor),
				},
				uColorOffset: {
					value: 0.08,
				},
				uColorMultiplier: {
					value: 5,
				},
			},
			vertexShader: `
			uniform float uTime;
			uniform float uBigWavesElevation;
			uniform vec2 uBigWavesFrequency;
			uniform float uBigWavesSpeed;

			uniform float uSmallWavesElevation;
			uniform float uSmallWavesFrequency;
			uniform float uSmallWavesSpeed;
			uniform float uSmallWavesIteration;

			varying float vElevation;

			// Classic Perlin 3D Noise
			// by Stefan Gustavson
			//
			vec4 permute(vec4 x)
			{
				return mod(((x*34.0)+1.0)*x, 289.0);
			}
			vec4 taylorInvSqrt(vec4 r)
			{
				return 1.79284291400159 - 0.85373472095314 * r;
			}
			vec3 fade(vec3 t)
			{
				return t*t*t*(t*(t*6.0-15.0)+10.0);
			}

			float cnoise(vec3 P)
			{
				vec3 Pi0 = floor(P); // Integer part for indexing
				vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
				Pi0 = mod(Pi0, 289.0);
				Pi1 = mod(Pi1, 289.0);
				vec3 Pf0 = fract(P); // Fractional part for interpolation
				vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
				vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
				vec4 iy = vec4(Pi0.yy, Pi1.yy);
				vec4 iz0 = Pi0.zzzz;
				vec4 iz1 = Pi1.zzzz;

				vec4 ixy = permute(permute(ix) + iy);
				vec4 ixy0 = permute(ixy + iz0);
				vec4 ixy1 = permute(ixy + iz1);

				vec4 gx0 = ixy0 / 7.0;
				vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
				gx0 = fract(gx0);
				vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
				vec4 sz0 = step(gz0, vec4(0.0));
				gx0 -= sz0 * (step(0.0, gx0) - 0.5);
				gy0 -= sz0 * (step(0.0, gy0) - 0.5);

				vec4 gx1 = ixy1 / 7.0;
				vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
				gx1 = fract(gx1);
				vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
				vec4 sz1 = step(gz1, vec4(0.0));
				gx1 -= sz1 * (step(0.0, gx1) - 0.5);
				gy1 -= sz1 * (step(0.0, gy1) - 0.5);

				vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
				vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
				vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
				vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
				vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
				vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
				vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
				vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

				vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
				g000 *= norm0.x;
				g010 *= norm0.y;
				g100 *= norm0.z;
				g110 *= norm0.w;
				vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
				g001 *= norm1.x;
				g011 *= norm1.y;
				g101 *= norm1.z;
				g111 *= norm1.w;

				float n000 = dot(g000, Pf0);
				float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
				float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
				float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
				float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
				float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
				float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
				float n111 = dot(g111, Pf1);

				vec3 fade_xyz = fade(Pf0);
				vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
				vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
				float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
				return 2.2 * n_xyz;
			}


			void main(){
				vec4 modelPosition = modelMatrix * vec4(position , 1.0);

				float elevationVariable = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed)
										*sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

				for(float i = 1.0 ; i<= uSmallWavesIteration ; i++){
					elevationVariable -= abs(cnoise(vec3(
					modelPosition.xz * uSmallWavesFrequency * i ,uTime * uSmallWavesSpeed
				)) * uSmallWavesElevation/i);
				}



				modelPosition.y += elevationVariable ;

				vec4 viewPosition = viewMatrix * modelPosition;
				vec4 projectedPosition = projectionMatrix * viewPosition;

				gl_Position = projectedPosition;

				vElevation = elevationVariable;
			}
			`,
			fragmentShader: `
			uniform vec3 uDepthColor;
			uniform vec3 uSurfaceColor;
			uniform float uColorOffset;
			uniform float uColorMultiplier;


			varying float vElevation;

			void main(){
				float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
				vec3 color = mix(uDepthColor  , uSurfaceColor , mixStrength);
				gl_FragColor = vec4(color , 1.0 );
			}
	  `,
		});

		let ground_plane = new THREE.Mesh(ground_geometry, this.ground_material);
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
		this.context.ben.model.position.x = 60;
		this.pickerArea.add(this.context.ben.model);

		this.mixer = new THREE.AnimationMixer(this.context.ben.model);
		this.idleClip = THREE.AnimationClip.findByName(
			this.context.ben.animations,
			"Idle"
		);
		this.idleAction = this.mixer.clipAction(this.idleClip);
		this.idleAction.play();

		this.scene.getObjectByName("aabb").visible = false;

		this.context.katy.model.scale.setScalar(4.25);
		this.context.katy.model.position.x = 45;
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
		this.context.captain.model.position.x = 15;
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

		this.context.bouncer.model.scale.setScalar(2);
		this.context.bouncer.model.position.x = 0;
		this.context.bouncer.model.position.z = 0.5;
		this.pickerArea.add(this.context.bouncer.model);
		this.context.bouncer.model.traverse((child) => {
			if (child.name === "aabb") child.visible = false;
		});

		this.bouncerWorldPos = new THREE.Vector3(0, 0, 0);
		this.context.bouncer.model.getWorldPosition(this.bouncerWorldPos);

		console.log(this.bouncerWorldPos);

		this.mixer____ = new THREE.AnimationMixer(this.context.bouncer.model);
		this.idleClip____ = THREE.AnimationClip.findByName(
			this.context.bouncer.animations,
			"Idle"
		);
		this.idleAction____ = this.mixer____.clipAction(this.idleClip____);
		this.idleAction____.play();

		this.playerModels = [
			{
				model: this.context.bouncer.model,
				animations: this.context.bouncer.animations,
			},
			{
				model: this.context.captain.model,
				animations: this.context.captain.animations,
			},
			{
				model: this.context.coach.model,
				animations: this.context.coach.animations,
			},
			{
				model: this.context.katy.model,
				animations: this.context.katy.animations,
			},
			{
				model: this.context.ben.model,
				animations: this.context.ben.animations,
			},
		];
	}

	next() {
		if (this.characterIndex >= 4) return;
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

		this.selectedCharacter = this.playerModels[this.characterIndex].model;
		console.log(this.selectedCharacter);

		this.selectedCharacter.position.set(0, 0, 0);
		this.selectedCharacter.rotation.set(0, 0, 0);

		this.context.playerInstance = new Player(
			this.context,
			this.selectedCharacter,
			this.playerModels[this.characterIndex].animations
		);

		// this.playerModels[]
		// console.log(this.characterIndex);

		this.mixer = null;
		this.mixer_ = null;
		this.mixer__ = null;
		this.mixer___ = null;

		this.pickerActive = false;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));
		this.ground_material.uniforms.uTime.value += 0.02;

		if (!this.pickerActive) return;
		if (this.mixer) this.mixer.update(this.context.time.getDelta());
		if (this.mixer_) this.mixer_.update(this.context.time.getDelta());
		if (this.mixer__) this.mixer__.update(this.context.time.getDelta());
		if (this.mixer___) this.mixer___.update(this.context.time.getDelta());
		if (this.mixer____) this.mixer____.update(this.context.time.getDelta());
		if (this.context.ben) this.context.ben.model.rotation.y += 0.015;
		if (this.context.katy) this.context.katy.model.rotation.y += 0.015;
		if (this.context.coach) this.context.coach.model.rotation.y += 0.015;
		if (this.context.captain) this.context.captain.model.rotation.y += 0.015;
		if (this.context.bouncer) this.context.bouncer.model.rotation.y += 0.015;

		if (this.characterIndex == 0) {
			this.prevButton.style.display = "none";
		} else {
			this.prevButton.style.display = "flex";
		}

		if (this.characterIndex == 4) {
			// console.log("=)");
			this.nextButton.style.display = "none";
		} else {
			this.nextButton.style.display = "flex";
		}
	}
}
