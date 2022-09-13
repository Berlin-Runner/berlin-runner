class BaseAudioComponent {
	constructor(context, opts) {
		this.context = context;

		this.audioUrl = opts.url;
		this.isMute = opts.isMute;
		this.loop = opts.doesLoop;
		this.volume = opts.volume;

		this.init();
	}

	init() {
		this.sound = new Audio(this.audioUrl);
		this.sound.muted = this.isMute;
		this.sound.loop = this.doesLoop;
		this.sound.volume = this.volume;

		this.sound.load();
	}

	play() {
		this.sound.play();
	}
}

export { BaseAudioComponent };
