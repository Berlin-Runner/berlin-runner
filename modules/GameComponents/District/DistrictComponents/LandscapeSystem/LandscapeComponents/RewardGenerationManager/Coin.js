import { UTIL } from "../../../../../../Util/UTIL.js";

class Coin {
	constructor(context, spawnPosition) {
		this.context = context;
		this.spawnPosition = spawnPosition;

		this.scene = this.context.gameWorld.scene;
		this.scoreBus = this.context.scoreEventBus;

		this.settings = {
			coinColliderMass: 0.0,
		};

		this.init();

		this.addClassSettings();
	}

	init() {
		this.modelLength = this.context.G.TILE_LENGTH;

		this.delta = new THREE.Clock();

		this.addCoin();

		this.update();
	}

	addCoin() {
		let coinGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16);
		let coinMaterial = new THREE.MeshStandardMaterial({
			color: new THREE.Color("gold"),
			metalness: 0.5,
			roughness: 0.25,
		});

		// this.coinMesh.position.copy(this.spawnPosition);
		this.coinMesh = new THREE.Mesh(coinGeo, coinMaterial);
		this.coinMesh.rotation.x = 90 * (Math.PI / 180);
		this.coinMesh.position.set(0, 0, 1);

		this.coinMesh2 = new THREE.Mesh(coinGeo, coinMaterial);
		this.coinMesh2.rotation.x = 90 * (Math.PI / 180);
		this.coinMesh2.position.set(0, 0, 2);

		this.coinMesh3 = new THREE.Mesh(coinGeo, coinMaterial);
		this.coinMesh3.rotation.x = 90 * (Math.PI / 180);
		this.coinMesh3.position.set(0, 0, 3);

		this.coinMesh4 = new THREE.Mesh(coinGeo, coinMaterial);
		this.coinMesh4.rotation.x = 90 * (Math.PI / 180);
		this.coinMesh4.position.set(0, 0, 4);

		this.coinMesh5 = new THREE.Mesh(coinGeo, coinMaterial);
		this.coinMesh5.rotation.x = 90 * (Math.PI / 180);
		this.coinMesh5.position.set(0, 0, 5);

		this.coinsHolder = new THREE.Group();
		this.coinsHolder.add(
			this.coinMesh,
			this.coinMesh2,
			this.coinMesh3,
			this.coinMesh4,
			this.coinMesh5
		);

		// this.coinsHolder.traverse((child) => {
		// 	child.position.z -= 1.5;
		// });

		this.scene.add(this.coinsHolder);
	}

	getCoin() {
		return this.coinsHolder;
	}

	updatePosition(placementPostion) {
		this.coinsHolder.position.x = placementPostion.x;
		this.coinsHolder.position.y = placementPostion.y;
		this.coinsHolder.position.z = placementPostion.z;
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.coinMesh.rotation.z += 0.05;
		this.coinMesh2.rotation.z += 0.045;
		this.coinMesh3.rotation.z += 0.04;
		this.coinMesh4.rotation.z += 0.035;
		this.coinMesh5.rotation.z += 0.03;

		this.coinsHolder.position.z +=
			this.modelLength *
			this.context.G.UPDATE_SPEED_FACTOR *
			this.delta.getDelta();
	}

	addClassSettings() {
		/* this.localSettings = this.context.gui.addFolder("COIN SETTINGS");
		this.localSettings
			.add(this.audioComponent, "volume", 0, 1, 0.0124)
			.onChange((value) => {
				this.audioComponent.volume = value;
			}); */
	}

	clone() {
		return new Coin(this.context, this.spawnPosition);
	}
}

export { Coin };
