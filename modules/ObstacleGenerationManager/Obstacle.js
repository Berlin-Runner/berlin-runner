import { UTIL } from "../Util/UTIL.js";

class Obstacle {
	constructor(context) {
		this.context = context;
	}

	async loadObstacle(url) {
		let { model } = await UTIL.loadModel(url);

		return model.children[0];
	}

	async initObstacle(url) {
		let model = await this.loadObstacle(url);
		let lanscapeMap = model.material.map;

		model.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
			class: THREE.CustomMaterial,

			vertex: {
				transformEnd: UTIL.getFoldableShader(),
			},
		});

		model.material.uniforms.map.value = lanscapeMap;

		model.material.map = lanscapeMap;

		return model;
	}
}

export { Obstacle };
