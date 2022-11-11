class Camer3rdPerson {
	constructor(context, player) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.player = player;

		this.time = new THREE.Clock();

		this.cameraOffsetProfiles = [
			{
				//BIRDS_EYE_VIEW
				y: 4.75,
				z: 8.5,
			},
			{
				//NORMAL_VIEW
				y: 2,
				z: 5.5,
			},
			{
				//COACH_VIEW
			},
		];

		this.currentCameraOffsetProfile = this.cameraOffsetProfiles[1];

		this.addClassSettings();
	}

	update() {
		if (!this.camera || !this.player) return;
		this.camera.position.y =
			this.player.position.y + this.currentCameraOffsetProfile.y;
		this.camera.position.z =
			this.player.position.z + this.currentCameraOffsetProfile.z;
	}

	addClassSettings() {
		let classSettings = this.context.gui.addFolder("CAMERA OFFSET PROFILE");
		classSettings
			.add(this, "currentCameraOffsetProfile", {
				BIRDS_EYE_VIEW: 0,
				NORMAL_VIEW: 1,
			})
			.onChange((value) => {
				console.log(value);
				this.currentCameraOffsetProfile = this.cameraOffsetProfiles[value];
			});
	}
}

export { Camer3rdPerson };
