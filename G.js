class G {
	constructor() {
		this.G = {
			scene: undefined,
			DEVICE_TYPE: "desktop",
			POINTER_LOCKED: true,
			TILE_LENGTH: 40,

			PLAYER_JUMPING: false,
			PLAYER_SLIDING: false,

			SELECTED_DISTRICT: 3,

			UPDATE_SPEED_FACTOR: 0.25,

			DISTANCE_TO_RIVER: 1200,
			DISTANCE_TO_BRIDGE: 1200,

			DISTANCE_TO_BUS: 1200,
		};
	}

	getG() {
		return this.G;
	}
}

export { G };
