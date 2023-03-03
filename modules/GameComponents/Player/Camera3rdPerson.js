class Camer3rdPerson {
	constructor(context, player) {
		this.context = context;
		this.camera = this.context.gameWorld.camera;
		this.player = player;

		this.time = new THREE.Clock();

		this.follow = false;

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

		this.currentIndex = 1;
		this.currentCameraOffsetProfile = this.cameraOffsetProfiles[1];

		this.addClassSettings();
	}

	update() {
		if (!this.camera || !this.player || !this.follow) return;
		this.camera.position.y =
			this.player.position.y + this.currentCameraOffsetProfile.y;
		this.camera.position.z =
			this.player.position.z + this.currentCameraOffsetProfile.z;
	}

	addClassSettings() {
		let classSettings = this.context.gui.addFolder("CAMERA OFFSET PROFILE");
		classSettings
			.add(this, "currentIndex", {
				BIRDS_EYE_VIEW: 0,
				NORMAL_VIEW: 1,
			})
			.onChange((value) => {
				console.log(value);
				this.currentIndex = value;
				this.currentCameraOffsetProfile = this.cameraOffsetProfiles[value];
			})
			.name("CURRENT.PROFILE");
	}
}

export { Camer3rdPerson };
