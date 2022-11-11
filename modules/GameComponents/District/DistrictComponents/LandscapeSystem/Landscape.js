import { UTIL } from "../../../../Util/UTIL.js";

class Landscape {
	constructor() {}

	async loadLandscape(url) {
		let { model } = await UTIL.loadModel(url);

		return model;
	}

	async initLandscape(url) {
		let model = await this.loadLandscape(url);
		// let lanscapeMap = model.material.map;

		// model.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
		// 	class: THREE.CustomMaterial,

		// 	vertex: {
		// 		transformEnd: UTIL.getFoldableShader(),
		// 	},
		// });

		// model.material.uniforms.map.value = lanscapeMap;

		// model.material.map = lanscapeMap;
		console.log(model);

		return model;
	}
}

export { Landscape };
