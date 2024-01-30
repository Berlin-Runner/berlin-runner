var params = {
	snowfall: 10,
}
class Snow extends THREE.Object3D {
	constructor() {
		super()
		this.snowList = []
		this.angle = 0

		var length = params.snowfall //雪の数

		var geometry = new THREE.BufferGeometry()

		var materials = []

		var textureLoader = new THREE.TextureLoader()
		var sprite1 = textureLoader.load(
			"../../assets/img/snowflakes/snowflake1.png?dl=0"
		)
		var sprite2 = textureLoader.load(
			"../../assets/img/snowflakes/snowflake2.png?dl=0"
		)
		var sprite3 = textureLoader.load(
			"../../assets/img/snowflakes/snowflake3.png?dl=0"
		)
		var sprite4 = textureLoader.load(
			"../../assets/img/snowflakes/snowflake4.png?dl=0"
		)
		var sprite5 = textureLoader.load(
			"../../assets/img/snowflakes/snowflake5.png?dl=0"
		)

		var vertices = []
		for (var i = 0; i < length; i++) {
			var x = getRandom(-1, 1)
			var y = getRandom(0, 200)
			var z = getRandom(0, 800)
			vertices.push(x, y, z)
		}

		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3)
		)

		var parameters = [
			["#FFFFFF", sprite2, getRandom(1, 4)],
			["#FFFFFF", sprite3, getRandom(1, 4)],
			["#FFFFFF", sprite1, getRandom(1, 4)],
			["#FFFFFF", sprite5, getRandom(2, 5)],
			["#FFFFFF", sprite4, getRandom(2, 5)],
		]

		for (var i = 0; i < parameters.length; i++) {
			var sprite = parameters[i][1]
			var size = parameters[i][2]
			materials[i] = new THREE.PointsMaterial({
				size: size,
				map: sprite,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true,
			})

			var particles = new THREE.Points(geometry, materials[i])
			particles.rotation.x = Math.random() * 360
			particles.rotation.y = Math.random() * 360
			particles.rotation.z = Math.random() * 360
			particles.vx = 0
			particles.vy = 0
			particles.material.opacity = 0

			this.add(particles)
			this.snowList.push(particles)
		}
	}

	update() {
		this.angle += 0.001

		for (var i = 0; i < this.snowList.length; i++) {
			this.snowList[i].material.opacity += 0.01
			this.snowList[i].vy -= 1
			this.snowList[i].vx = Math.sin(this.angle) * Math.cos(this.angle) * 10

			this.snowList[i].vx *= 0.2
			this.snowList[i].vy *= 0.6

			this.snowList[i].position.x += this.snowList[i].vx
			this.snowList[i].position.y += this.snowList[i].vy

			if (this.snowList[i].position.y < -1000) {
				this.snowList[i].material.opacity += 0.1
				this.remove(this.snowList[i])
				this.snowList.splice(i, 1)
				i -= 1
			}
		}
	}
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min
}

export { Snow }
