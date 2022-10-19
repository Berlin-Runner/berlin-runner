const loader = new THREE.GLTFLoader();
const foldableShader = `
  vec4 vWorld = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  float curveAmount = 0.00125;

  vWorld -= cameraPosition.y;
  vec3 vShift = vec3( pow2(vWorld.z) * - curveAmount * .675, pow2(vWorld.z) * - curveAmount, pow2(vWorld.z) * .00000000 );

  transformed += vShift;
`;

class UTIL {
	static async sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	static wait(ms) {
		const start = Date.now();
		let now = start;
		while (now - start < ms) {
			now = Date.now();
		}
	}

	static randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static async loadModel(url) {
		return new Promise((resolve, reject) => {
			loader.load(
				url,
				(gltf) => {
					let result = { model: gltf.scene, animations: gltf.animations };
					resolve(result);
				},
				(progress) => {
					//   console.log(progress);
				},
				(err) => {
					reject(err);
				}
			);
		});
	}

	static getFoldableShader() {
		return foldableShader;
	}
}

/*
THIS IS TEST CODE FROM MY NEW MBPÍ
*/

export { UTIL };
