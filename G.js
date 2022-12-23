class G {
	constructor() {
		this.G = {
			scene: undefined,
			DEVICE_TYPE: "desktop",
			POINTER_LOCKED: true,
			TILE_LENGTH: 40,

			PLAYER_JUMPING: false,
			PLAYER_SLIDING: false,
		};
	}

	getG() {
		return this.G;
	}
}

export { G };
