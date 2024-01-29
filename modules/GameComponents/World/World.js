class World_ {
	constructor(context) {
		this.context = context
		this.init()
		this.resize()
		this.setupResize()
		this.addClassSettings()
	}

	init() {
		this.initCamera()

		this.initScene()

		this.initRenderer()

		this.initControls()

		this.initLights()

		// this.addSun()

		this.addRain()

		this.globalUniforms = {
			time: { value: 0 },
			globalBloom: { value: 0 },
			noise: { value: null },
		}

		this.time = new THREE.Clock()
		// console.log(this.time)

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
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			0.1,
			100000.0
		)
	}

	initScene() {
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color("#87CEFA")
	}

	initRenderer() {
		this.canvas = document.getElementById("webgl")

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		})

		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio * 0.5)

		this.renderer.outputEncoding = THREE.sRGBEncoding
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		this.renderer.physicallyCorrectLights = true

		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

		this.canvas.appendChild(this.renderer.domElement)
	}

	initControls() {
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		)
		this.controls.enabled = false
	}

	initLights() {
		let ambLight = new THREE.AmbientLight("#ffffff", 1)
		this.scene.add(ambLight)
	}

	addSun() {
		let sunGeo = new THREE.SphereGeometry(0.5, 32, 32)
		let sunMat = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			emissive: 0xffffff,
			emissiveIntensity: 1,
			metalness: 0,
			roughness: 0,
			transparent: true,
			opacity: 0.99,
			side: THREE.DoubleSide,
		})
		// add a sphere mesh representing the sun
		this.sun = new THREE.Mesh(sunGeo, sunMat)
		this.sun.position.set(0, -1, -50)
		this.scene.add(this.sun)

		this.sunlight = new THREE.DirectionalLight(0xffffff, 1)

		// Set the position of the light to simulate the sun's position
		this.sunlight.position.set(-2, 5, 0)
		this.sunlight.castShadow = true

		// Optional: Configure shadow properties for better quality
		this.sunlight.shadow.mapSize.width = 1024 // Default is 512
		this.sunlight.shadow.mapSize.height = 1024 // Default is 512
		this.sunlight.shadow.camera.near = 0.5 // Default is 0.5
		this.sunlight.shadow.camera.far = 500 // Default is 500

		// this.scene.add(this.sunlight)

		// this.animateSun()
	}

	animateSun() {
		// 60sec * [n]Minutes
		let morningToMiddayDuration = 60 * 0.5

		const startPos = { x: 0, y: -2, z: -100 }
		const endPos = { x: 0, y: 20, z: -15 }

		// Starting and ending colors
		const startColor = new THREE.Color(0xff4500) // Reddish color for morning
		const endColor = new THREE.Color(0xffffff) // White color for midday

		// GSAP animation for position
		gsap.to(startPos, {
			duration: morningToMiddayDuration, // Duration in seconds (5 minutes)
			x: endPos.x,
			y: endPos.y,
			z: endPos.z,
			onUpdate: () => {
				// Update the position of the sun and the light
				this.sun.position.set(startPos.x, startPos.y, startPos.z)
				this.sunlight.position.set(startPos.x, startPos.y, startPos.z)
			},
		})

		// GSAP animation for color
		gsap.to(startColor, {
			duration: morningToMiddayDuration,
			r: endColor.r,
			g: endColor.g,
			b: endColor.b,
			onUpdate: () => {
				// Interpolate the color
				const currentColor = new THREE.Color(
					startColor.r,
					startColor.g,
					startColor.b
				)
				this.sun.material.color = currentColor
				this.sun.material.emissive = currentColor
				this.sunlight.color = currentColor
			},
		})
	}

	addRain() {
		// "drops"
		let gPos = []
		let gEnds = []
		let gCount = 5000
		for (let i = 0; i < gCount; i++) {
			let x = THREE.MathUtils.randFloatSpread(15)
			let y = THREE.MathUtils.randFloat(-5, 20)
			let z = THREE.MathUtils.randFloatSpread(50)
			let len = THREE.MathUtils.randFloat(0.25, 0.35)
			gPos.push(x, y, z, x, y, z)
			gEnds.push(0, len, 1, len)
		}
		let gg = new THREE.BufferGeometry()
		gg.setAttribute("position", new THREE.Float32BufferAttribute(gPos, 3))
		gg.setAttribute("gEnds", new THREE.Float32BufferAttribute(gEnds, 2))
		let gm = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			onBeforeCompile: (shader) => {
				shader.uniforms.time = this.globalUniforms.time
				shader.uniforms.noiseTex = this.globalUniforms.noise
				shader.uniforms.globalBloom = this.globalUniforms.globalBloom
				shader.vertexShader = `
      uniform float time;
      uniform sampler2D noiseTex;
      attribute vec2 gEnds;
      varying float vGEnds;
      varying float vH;

      ${shader.vertexShader}
    `.replace(
					`#include <begin_vertex>`,
					`#include <begin_vertex>

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
				)

				shader.fragmentShader = `
	uniform float time;
	uniform float globalBloom;
	varying float vGEnds;
	varying float vH;
	${this.noise}
	${shader.fragmentShader}
	`.replace(
					`vec4 diffuseColor = vec4( diffuse, opacity );`,
					`
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
				)
			},
		})
		let go = new THREE.LineSegments(gg, gm)
		this.scene.add(go)
	}

	setupResize() {
		window.addEventListener("resize", this.resize.bind(this))
	}

	resize() {
		let w = window.innerWidth
		let h = window.innerHeight

		this.renderer.setSize(w, h)
		this.camera.aspect = w / h
		this.camera.updateProjectionMatrix()
	}

	update() {
		if (this.controls.enabled) this.controls.update()
		this.renderer.render(this.scene, this.camera)
		this.updateScene()
	}

	updateScene(t) {
		// for(let i = 0; i<instCount; i++){
		//   let li = lucesInit[i];
		//   let z = ((li.y + t + 25) % 50) - 25;
		//   luces[i].y = z;
		//   luces[i].w = (Math.sin(t * li.w * (i % 3 + 1)) * Math.cos(t  * li.w * (i % 5 + 1)) * 0.25 + 0.25) * li.z + li.z * 0.75;
		//   lg.attributes.instData.setY(i, z);
		// }
		// lg.attributes.instData.needsUpdate = true
		this.globalUniforms.time.value = this.time.getElapsedTime()
	}

	addClassSettings() {
		this.localSettings = this.context.gui.addFolder("WORLD SETTINGS")

		this.localSettings
			.add(this.controls, "enabled")
			.onChange((value) => {
				this.controls.enabled = value
				this.context.settingEventBus.publish("go-hands-free", value)
			})
			.name("hands-free")

		this.localSettings.open()
	}
}

export { World_ }
