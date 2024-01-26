const foldableShader = `
  vec4 vWorld = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  float curveAmount = 0.00125;

  vWorld -= cameraPosition.y;
  vec3 vShift = vec3( pow2(vWorld.z) * - curveAmount * .675, pow2(vWorld.z) * - curveAmount, pow2(vWorld.z) * .005);
//   vec3 vShift = vec3(pow2(vWorld.z) * - curveAmount , 0. , 0.);
//   vec3 vShift = vec3(0. , 0. , 0.);

  transformed += vShift;
`

// Bending parameters
const BEND_AMOUNT = 0.05
const BEND_RADIUS = 100.0

class UTIL {
	static async sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	static wait(ms) {
		const start = Date.now()
		let now = start
		while (now - start < ms) {
			now = Date.now()
		}
	}

	static randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	static getFoldableShader() {
		return foldableShader
	}

	static randomOffsetVal(value) {
		return value + Math.floor(Math.random() * 10000) * 0.000001
	}

	// Linear mapping from range <a1, a2> to range <b1, b2>
	static mapLinear(x, a1, a2, b1, b2) {
		return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1)
	}

	static cannonToThreeVec3(cannonvec3) {
		return new THREE.Vector3(
			cannonToThreejsVec3.x,
			cannonToThreejsVec3.y,
			cannonToThreejsVec3.z
		)
	}

	static threeToCannonVec3(cannonvec3) {
		return new Vec3(
			threeToCannonVec3.x,
			threeToCannonVec3.y,
			threeToCannonVec3.z
		)
	}

	static bendMesh(model, toggleDiffuse) {
		model.traverse((child) => {
			if (child.isMesh) {
				let color = child.material.color
				let uniform
				if (toggleDiffuse) {
					uniform = {
						diffuse: { value: new THREE.Color(color.r, color.g, color.b) },
					}
				} else {
					uniform = {
						map: { value: child.material.map },
					}
				}
				child.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
					class: THREE.CustomMaterial,

					vertex: {
						transformEnd: `
                        // Bending formula
                        float theta = ${parseFloat(
													BEND_AMOUNT
												)} * worldPosition.z / ${parseFloat(BEND_RADIUS)}.0;

                        worldPosition.y = worldPosition.y * cos(theta) - worldPosition.z * sin(theta);
                    `,
					},

					uniforms: uniform,
				})

				child.material.onBeforeCompile = function (shader) {
					shader.vertexShader = shader.vertexShader
						.replace(
							"#include <begin_vertex>",
							`vec4 worldPosition = modelMatrix * vec4(position, 1.0);`
						)
						.replace(
							"#include <project_vertex>",
							`vec4 mvPosition = viewMatrix * worldPosition; gl_Position = projectionMatrix * mvPosition;`
						)
				}

				child.material.color = new THREE.Color(color.r, color.g, color.b)
				child.material.needsUpdate = true
			}
		})
	}
}

/*
THIS IS TEST CODE FROM MY NEW MBPÍ
*/

export { UTIL }
