import { UTIL } from "../Util/UTIL.js";

class Obstacle {
	constructor(context) {
		this.context = context;
		this.healthBus = this.context.playerHealthEventBus;
	}

	async loadObstacle(url) {
		let { model } = await UTIL.loadModel(url);

		return model.children[0];
	}

	async initObstacle(url) {
		let model = await this.loadObstacle(url);

		let obstacleMap = null;
		if (model.material.map) {
			obstacleMap = model.material.map;
		}

		model.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
			class: THREE.CustomMaterial,

			vertex: {
				transformEnd: UTIL.getFoldableShader(),
			},
		});

		model.material.uniforms.map.value = obstacleMap;

		model.material.map = obstacleMap;

		return model;
	}
}

export { Obstacle };
