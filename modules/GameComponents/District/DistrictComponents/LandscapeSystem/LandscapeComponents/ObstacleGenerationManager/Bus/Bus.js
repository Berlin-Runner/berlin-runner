import { Obstacle } from "../Obstacle.js";
import { UTIL } from "../../../../../../../Util/UTIL.js";
import {
	Vec3,
	Box,
	Body,
	BODY_TYPES,
} from "../../../../../../../../libs/cannon-es.js";
import { BaseAudioComponent } from "/modules/Core/AudioManager/BaseAudioComponent.js";
import CannonUtils from "../../../../../../../Core/PhysicsManager/utils/cannonUtils.js";

class Bus extends Obstacle {
	constructor(context, spawnPosition) {
		super(context);
		this.scene = this.context.gameWorld.scene;
		this.modelLength = this.context.G.TILE_LENGTH;
		this.spawnPosition = spawnPosition;

		this.delta = new THREE.Clock();
		this.time = new THREE.Clock();

		this.settings = {
			carColliderMass: 0,
		};

		this.audioComponent = new BaseAudioComponent(this.context, {
			url: "./assets/sounds/oooo.mp3",
			isMute: false,
			doesLoop: false,
			volume: 0.125,
		});

		this.modelUrl =
			"/modules/GameComponents/District/DistrictComponents/LandscapeSystem/LandscapeComponents/ObstacleGenerationManager/Bus/Model/bus.glb";

		this.loadCar();
	}

	async loadCar() {
		this.carFull = this.initObstacle(this.modelUrl);

		// let carMesh = this.carFull.model;

		this.carFull.then((res) => {
			// res.model.scale.setScalar(0.75);
			res.model.position.y += 1.5;
			this.carMesh = res.model;

			this.scene.add(this.carMesh);

			// console.log(this.carMesh);

			// let busesCollider = this.scene.getObjectByName("buses_collider");

			// busesCollider.visible = false;

			this.attachCollider(this.carMesh);
			// this.cannonifyMeshGeometry(busesCollider, "bus", BODY_TYPES.KINEMATIC, 1);
			requestAnimationFrame(this.update.bind(this));
		});
	}
	async loadObstacle(url) {
		let { model, animations } = await UTIL.loadModel(url);

		return { model, animations };
	}

	cannonifyMeshGeometry(meshToBeCanonified, meshName, bodyType, bodyMass) {
		if (!meshToBeCanonified) {
			console.log(`uh oh the mesh ${meshName} seems to be problematic`);
			return;
		}

		let shape = CannonUtils.CreateTrimesh(meshToBeCanonified.geometry);

		let meshBody = new Body({
			type: bodyType,
			mass: bodyMass,
		});

		meshBody.addShape(shape);
		meshBody.position.copy(meshToBeCanonified.position);
		meshBody.quaternion.copy(meshToBeCanonified.quaternion);
		this.collider = meshBody;

		// if (collisionFilterGroup != 1)
		// 	meshBody.collisionFilterGroup = collisionFilterGroup;
		this.context.world.addBody(meshBody);
		this.setupEventListners();
	}

	attachCollider(parentMesh) {
		const halfExtents = new Vec3(1.75, 0.75, 1);
		const boxShape = new Box(halfExtents);
		let carCollider = new Body({
			// mass: this.settings.carColliderMass,
			material: this.physicsMaterial,
			type: Body.STATIC,
		});
		carCollider.addShape(boxShape);
		carCollider.position.z = parentMesh.position.z;
		carCollider.position.x = parentMesh.position.x + 0.2;
		carCollider.position.y = parentMesh.position.y + 0.1;

		this.context.world.addBody(carCollider);
		this.collider = carCollider;

		this.setupEventListners(carCollider);
	}

	setupEventListners() {
		this.collider.addEventListener("collide", (event) => {
			const { contact } = event;

			if (contact.bi.id === this.context.playerCollider.id) {
				this.audioComponent.play();
				this.healthBus.publish("add-damage", 4);
				console.log("player collided with car");
				return;
			}
		});
	}

	updatePosition(placementPostion) {
		if (!this.collider) return;

		this.collider.position.z = placementPostion.z;
		this.carMesh.position.x = placementPostion.x;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.collider.position.z += (this.modelLength / 2) * this.delta.getDelta();
		this.carMesh.position.z = this.collider.position.z;
		// this.collider.position.y = this.carMesh.position.y + 1;
		this.collider.position.x = this.carMesh.position.x;

		// if (this.mixer) this.mixer.update(this.time.getDelta());
	}

	clone() {
		return new Bus(this.context, this.spawnPosition);
	}
}

export { Bus };
