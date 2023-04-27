class Camera3rdPerson {
	constructor(context, player) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.player = player;

		this.follow = true;

		this.cameraOffsetProfiles = {
			BIRDS_EYE_VIEW: { y: 4.75, z: 8.5 },
			NORMAL_VIEW: { y: 2, z: 5.5 },
			COACH_VIEW: {},
		};

		this.currentProfile = "NORMAL_VIEW";
		this.currentCameraOffset = this.cameraOffsetProfiles[this.currentProfile];

		this.cameraDistance = 5.5;
		this.elevationAngle = Math.PI / 2.75;
		this.rotationAngle = Math.PI / 2;

		this.addClassSettings();

		this.camOffsetX =
			this.cameraDistance *
			Math.sin(this.elevationAngle) *
			Math.cos(this.rotationAngle);
		this.camOffsetY = this.cameraDistance * Math.cos(this.elevationAngle);
		this.camOffsetZ =
			this.cameraDistance *
			Math.sin(this.elevationAngle) *
			Math.sin(this.rotationAngle) *
			0.8;
	}

	/*
	 * With this approach, you can adjust the cameraDistance, elevationAngle, and rotationAngle properties to set the camera's position relative to the player. The update method will then compute the camera's position in Cartesian coordinates and set the camera to look at the player.
	 */
	update() {
		if (this.context.G.PLAYER_SLIDING) return;

		this.camera.position.set(
			this.player.position.x + this.camOffsetX,
			this.player.position.y + this.camOffsetY,
			this.player.position.z + this.camOffsetZ
		);

		// console.log(this.camera.position.z);

		// this.camera.lookAt(this.player.position);
	}

	addClassSettings() {
		const classSettings = this.context.gui.addFolder("CAMERA OFFSET PROFILE");
		classSettings
			.add(this, "currentProfile", Object.keys(this.cameraOffsetProfiles))
			.onChange((value) => {
				this.currentProfile = value;
				this.currentCameraOffset = this.cameraOffsetProfiles[value];
			})
			.name("CURRENT.PROFILE");
	}
}

export { Camera3rdPerson };
