import { UTIL } from "../../../../../Util/UTIL.js"

/* const vertexShader = `
	varying vec2 vUv;
	void main() {
		vec4 worldPosition = modelMatrix * vec4(position, 1.0);

		// Adjust these parameters as needed
		float bendAmount = 0.05;
		float bendRadius = 50.0;

		// Bending formula
		float theta = bendAmount * worldPosition.z / bendRadius;
		worldPosition.y = worldPosition.y * cos(theta) - worldPosition.z * sin(theta);

		gl_Position = projectionMatrix * viewMatrix * worldPosition;

		vUv = uv;
	}


`

const fragmentShader = `
	varying vec2 vUv;
	uniform vec3 color;
	uniform sampler2D diffuse;

	void main() {
		vec4 texelColor = texture2D(diffuse, vUv);
		gl_FragColor = texelColor * vec4(color, 1.0);
		// Add lighting, specular highlights, etc., as needed
	}
` */

class LandscapeTile {
	constructor(context, tileUrl) {
		this.context = context
		this.tileUrl = tileUrl

		return this.initLandscape(tileUrl)
	}

	async initLandscape(url) {
		try {
			let { model } = await this.context.assetLoader.loadModel(url)
			model.traverse((child) => {
				if (child.isMesh) {
					child.receiveShadow = true
				}
			})
			UTIL.bendMesh(model, false)
			// model.visible = false

			return model
		} catch (err) {
			console.log(err)
		}
	}

	clone() {
		return new LandscapeTile(this.tileUrl)
	}
}

export { LandscapeTile }
