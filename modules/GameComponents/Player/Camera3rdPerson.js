class Camer3rdPerson {
	constructor(context, player) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.player = player;

		this.time = new THREE.Clock();
	}

	update() {
		if (!this.camera || !this.player) return;
		this.camera.position.y = this.player.position.y + 4.75;
		this.camera.position.z = this.player.position.z + 8.5;
	}
}

export { Camer3rdPerson };
