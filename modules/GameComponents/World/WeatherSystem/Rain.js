class Rain {
	constructor(world) {
		this.world = world

		this.noise = `
		float N21 (vec2 st) { // https://thebookofshaders.com/10/
			return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
		}

		float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU

			vec2 lv = fract( ip );
		  vec2 id = floor( ip );

		  lv = lv * lv * ( 3. - 2. * lv );

		  float bl = N21( id );
		  float br = N21( id + vec2( 1, 0 ));
		  float b = mix( bl, br, lv.x );

		  float tl = N21( id + vec2( 0, 1 ));
		  float tr = N21( id + vec2( 1, 1 ));
		  float t = mix( tl, tr, lv.x );

		  return clamp(mix( b, t, lv.y ) * 0.5 + 0.5, 0., 1.);
		}

		float smoothNoise2(vec2 p){

		  p.y += time;
		  p /= 4.;

		  float n = smoothNoise(p) * 1.5;
		  n += smoothNoise(p * 2.01) * 0.25;
		  n += smoothNoise(p * 4.02) * 0.125;
		  n += smoothNoise(p * 8.03) * 0.0625;
		  n /= (1.5 + 0.25 + 0.125 + 0.0625);
		  return clamp(n, 0., 1.);
		}
		`

		this.globalUniforms = {
			time: { value: 0 },
			globalBloom: { value: 0 },
			noise: { value: null },
		}

		this.time = new THREE.Clock()

		this.init()
	}

	init() {
		this.addRain()
	}

	generateRainGeometry(gCount) {
		let gPos = []
		let gEnds = []

		for (let i = 0; i < gCount; i++) {
			let x = THREE.MathUtils.randFloatSpread(15)
			let y = THREE.MathUtils.randFloat(-5, 20)
			let z = THREE.MathUtils.randFloatSpread(50)
			let len = THREE.MathUtils.randFloat(0.25, 0.35)
			gPos.push(x, y, z, x, y, z)
			gEnds.push(0, len, 1, len)
		}

		let geometry = new THREE.BufferGeometry()
		geometry.setAttribute("position", new THREE.Float32BufferAttribute(gPos, 3))
		geometry.setAttribute("gEnds", new THREE.Float32BufferAttribute(gEnds, 2))

		return geometry
	}

	createRainMaterial(globalUniforms, noiseShader) {
		let material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			onBeforeCompile: (shader) => {
				this.setupRainShader(shader, globalUniforms, noiseShader)
			},
		})

		return material
	}

	setupRainShader(shader, globalUniforms, noiseShader) {
		shader.uniforms.time = globalUniforms.time
		shader.uniforms.noiseTex = globalUniforms.noise
		shader.uniforms.globalBloom = globalUniforms.globalBloom
		shader.vertexShader = `
			uniform float time;
			uniform sampler2D noiseTex;
			attribute vec2 gEnds;
			varying float vGEnds;
			varying float vH;

			${shader.vertexShader}
		`.replace(`#include <begin_vertex>`, this.vertexShaderReplacer())

		shader.fragmentShader = `
			uniform float time;
			uniform float globalBloom;
			varying float vGEnds;
			varying float vH;
			${noiseShader}
			${shader.fragmentShader}
		`.replace(
			`vec4 diffuseColor = vec4( diffuse, opacity );`,
			this.fragmentShaderReplacer()
		)
	}

	vertexShaderReplacer() {
		return `
			#include <begin_vertex>
			vec3 pos = position;
			vec2 nUv = (vec2(pos.x, -pos.z) - vec2(-25.)) / 50.;
			float h = texture2D(noiseTex, nUv).g;
			h = (h - 0.5) * 5.;
			pos.y = -mod(10. - (pos.y - time * 7.5), 15.) + 5.;
			h = pos.y - h;
			pos.y += gEnds.x * gEnds.y;
			transformed = pos;
			vGEnds = gEnds.x;
			vH = smoothstep(3., 0., h);
		`
	}

	fragmentShaderReplacer() {
		return `
			float op = 1. - vGEnds;
			op = pow(op, 3.);
			float h = (pow(vH, 3.) * .5 + 0.5);
			vec3 col = diffuse * h; // lighter close to the surface
			col *= 1. + smoothstep(0.99, 1., h); // sparkle at the surface
			if (globalBloom > 0.5) {
				//col *= 0.5;
			}
			vec4 diffuseColor = vec4( col, op );
		`
	}

	addRain() {
		const gCount = 2500
		let rainGeometry = this.generateRainGeometry(gCount)
		let rainMaterial = this.createRainMaterial(this.globalUniforms, this.noise)
		let rainObject = new THREE.LineSegments(rainGeometry, rainMaterial)
		this.rainObject = rainObject
		this.world.scene.add(rainObject)
	}

	updateRain() {
		this.globalUniforms.time.value = this.time.getElapsedTime()
	}
}

export { Rain }
