import {
	Vec3,
	World,
	SplitSolver,
	Material,
	ContactMaterial,
	Body,
	Plane,
	GSSolver,
} from "../../libs/cannon-es.js";
import CannonUtils from "./utils/cannonUtils.js";

class PhysicsManager {
	constructor(context) {
		this.context = context;

		this.deviceType = this.context.G.DEVICE_TYPE;

		// console.log(this.context.G.DEVICE_TYPE);

		this.settings = {
			worldAllowSleep: true,
			useSplitSolver: true,

			gravity: new THREE.Vector3(0, -9.8 * 3.5, 0),

			globalContactMaterial: {
				friction: 0,
				restitution: 0.9,
			},

			playerColliderRadius: 0.45,
			playerColliderMass: 67,
			playerInitialPosition: new Vec3(0, 0.75, 0),
			playerLinearDampeneingFactor: 1,
		};

		this.initWorld();
		// this.addClassSettings();
	}

	initWorld() {
		// console.log(this.deviceType);
		this.context.world = new World({});

		this.context.world.allowSleep = this.settings.worldAllowSleep;

		this.context.world.defaultContactMaterial.contactEquationStiffness = 1e9;

		// Stabilization time in number of timesteps
		this.context.world.defaultContactMaterial.contactEquationRelaxation = 4;

		this.solver = new GSSolver();
		if (this.deviceType === "desktop") {
			this.solver.iterations = 1;
		} else if (this.deviceType === "mobile") {
			this.solver.iterations = 1;
		}
		this.solver.tolerance = 1;
		if (this.settings.useSplitSolver) {
			this.context.world.solver = new SplitSolver(this.solver);
		} else {
			this.context.world.solver = new SplitSolver(this.solver);
			// this.context.world.solver = this.solver;
		}

		this.context.world.gravity = this.settings.gravity;

		this.physicsMaterial = new Material("physics");

		this.physics_physics = new ContactMaterial(
			this.physicsMaterial,
			this.physicsMaterial,
			{
				friction: this.settings.globalContactMaterial.friction,
				restitution: this.settings.globalContactMaterial.restitution,
			}
		);

		this.context.world.addContactMaterial(this.physics_physics);

		this.groundBody = new Body({
			type: Body.STATIC,
			shape: new Plane(),
		});
		this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		this.context.world.addBody(this.groundBody);
	}

	cannonifyMeshAutoHull(
		meshToBeCanonified,
		hullType,
		bodyType,
		bodyMaterial,
		bodyMass,
		collisionFilterGroup = 1
	) {
		let canonifiedMesh = threeToCannon(meshToBeCanonified, { type: hullType });

		let { shape } = canonifiedMesh;

		let cannonifiedBody = new Body({
			mass: bodyMass,
			type: bodyType,
			shape,
			material: bodyMaterial,
		});

		cannonifiedBody.position.copy(meshToBeCanonified.position);
		cannonifiedBody.quaternion.copy(meshToBeCanonified.quaternion);

		this.context.world.addBody(cannonifiedBody);
	}

	cannonifyMeshGeometry(
		meshToBeCanonified,
		meshName,
		bodyType,
		bodyMaterial,
		bodyMass,
		scale = new Vec3(1, 1, 1),
		collisionFilterGroup = 1
	) {
		if (!meshToBeCanonified) {
			// console.log(`uh oh the mesh ${meshName} seems to be problematic`);
			return;
		}

		let shape = CannonUtils.CreateTrimesh(meshToBeCanonified.geometry);
		shape.scale.copy(scale);

		// shape.scale.set(0.75, 0.75, 0.75);
		let meshBody = new Body({
			type: bodyType,
			material: bodyMaterial,
			mass: bodyMass,
		});

		meshBody.addShape(shape);
		meshBody.position.copy(meshToBeCanonified.position);
		meshBody.quaternion.copy(meshToBeCanonified.quaternion);

		if (collisionFilterGroup != 1)
			meshBody.collisionFilterGroup = collisionFilterGroup;
		this.context.world.addBody(meshBody);
	}

	cannonifyMeshWithCustomConvexHull(
		customConvexHullGeometry,
		meshToBeCanonified,
		collisionFilterGroup = 1
	) {
		let shape = CannonUtils.CreateTrimesh(customConvexHullGeometry.geometry);

		let customConvexHullBody = new Body({
			material: this.physicsMaterial,
		});

		customConvexHullBody.addShape(shape);

		customConvexHullBody.position.copy(meshToBeCanonified.position);
		customConvexHullBody.quaternion.set(0, 0, 0, 1);

		// console.log(customConvexHullBody);

		this.context.world.addBody(customConvexHullBody);
	}

	addClassSettings() {
		/*
      worldAllowSleep: true,
      useSplitSolver: false,

      gravity: new THREE.Vector3(0, -9.8, 0),

      globalContactMaterial: {
        friction: 0.1,
        restitution: 0.3,
      },

      playerColliderRadius: 0.425,
      playerColliderMass: 0.25,
      playerInitialPosition: new THREE.Vector3(-2, 3, -1),
    */
		let localSettings = this.context.gui.addFolder("GLOBAL PHYSICS PROPERTIES");
		let obj = {
			renderingState: "none",
		};
		localSettings
			.add(obj, "renderingState", {
				renderNone: "none",
				renderCameraColliderOnly: "camera",
				renderEnvironmentCollidersOnly: "envt",
				renderAll: null,
			})
			.onChange((value) => {
				this.context.cannonDebugger.updateRenderingState(value);
			});

		localSettings.add(this.settings, "worldAllowSleep").name("Allow Sleep");

		localSettings
			.add(this.settings.gravity, "y", -20, 5, 0.25)
			.name("Gravity Value");

		localSettings
			.add(this.settings.globalContactMaterial, "friction", 0, 1, 0.01)
			.name("Global Friction")
			.onChange((value) => {
				this.context.world.contactmaterials[0].friction = value;
			});
		localSettings
			.add(this.settings.globalContactMaterial, "restitution", 0, 1, 0.01)
			.name("Global Restitution")
			.onChange((value) => {
				this.context.world.contactmaterials[0].restitution = value;
				this.context.debugLog.error(this.context.world);
			});

		let playerColliderSettings = localSettings.addFolder(
			"PLAYER COLLIDER SETTINGS"
		);

		playerColliderSettings.open();

		playerColliderSettings
			.add(this.settings, "playerColliderRadius", 0.1, 0.5, 0.001)
			.onChange((value) => {
				this.context.sphereBody.shapes[0].radius = value;
			})
			.name("Radius");

		playerColliderSettings
			.add(this.settings, "playerColliderMass", 0.1, 1, 0.05)
			.onChange((value) => {
				this.context.sphereBody.mass = value;
			})
			.name("Mass");

		playerColliderSettings
			.add(this.settings, "playerLinearDampeneingFactor", 0, 1, 0.05)
			.onChange((value) => {
				this.context.sphereBody.linearDamping = this.mapLinear(
					value,
					0,
					1,
					0.95,
					0.99
				);
			})
			.name("Collider Friction");

		let playerInitialPosition = playerColliderSettings.addFolder(
			"PLAYER INITIAL POSITION"
		);

		playerInitialPosition.open();

		playerInitialPosition
			.add(this.settings.playerInitialPosition, "x", -5, 5, 0.5)
			.onChange((value) => {
				this.context.sphereBody.position.X = value;
			})
			.name("X");

		playerInitialPosition
			.add(this.settings.playerInitialPosition, "y", 0, 15, 0.5)
			.onChange((value) => {
				this.context.sphereBody.position.X = value;
			})
			.name("Y");

		playerInitialPosition
			.add(this.settings.playerInitialPosition, "z", -5, 5, 0.5)
			.onChange((value) => {
				this.context.sphereBody.position.X = value;
			})
			.name("Z");
	}

	// ===========================++++++++++++++++++===========================//
	// Linear mapping from range <a1, a2> to range <b1, b2>
	mapLinear(x, a1, a2, b1, b2) {
		return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
	}
}

class Ball {
	constructor(body, mesh, active) {
		this.body = body;
		this.mesh = mesh;
		this.active = active;

		// this.autoDestructSequence();
	}

	autoDestructSequence() {
		setTimeout(() => {
			// console.log("DESTROYING MEIN SELF");
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			this.body.removeShape();
			this.body.sleep();
		}, 1 * 1000);
	}
}

export { PhysicsManager };
