class AudioManager {
	constructor(context) {
		this.context = context;

		this.audioUrl = "./assets/sounds/sound.mp3";
		this.audio = new Audio(this.audioUrl);
		this.isMute = true;

		this.dingUrl = "./assets/sounds/ding.mp3";
		this.dingSound = new Audio(this.dingUrl);
		this.dingSound.loop = false;
		this.dingSound.volume = 1;
		this.dingSound.load();

		this.muteIcons = document.getElementsByClassName("mute-icon");
		this.muteIconText = document.getElementsByClassName("mute-icon-text");

		this.init();
		this.setupMuteListener();
	}

	init() {
		this.audio.loop = true;
		this.audio.volume = 0.5;
		this.audio.play();
		this.audio.muted = this.isMute;

		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {
		this.context.audioEventBus.subscribe("ding", () => {
			console.log("dinging");
			this.dingSound.play();
		});
	}

	setupMuteListener() {
		document.addEventListener("keypress", (e) => {
			if (e.code === "KeyM") {
				if (this.isMute) {
					this.unmuteAudio();
				} else {
					this.muteAudio();
				}
			}
		});
	}

	muteAudio() {
		console.log("MUTING THE AUDIO");
		this.isMute = !this.isMute;
		this.audio.muted = true;
		Array.from(this.muteIcons).forEach((icon) => {
			icon.innerText = "volume_off";
		});
		Array.from(this.muteIconText).forEach((icon) => {
			icon.innerText = "MUTED";
		});
	}

	unmuteAudio() {
		console.log("UNMUTING AUDIO");
		this.isMute = !this.isMute;
		this.audio.muted = false;
		Array.from(this.muteIcons).forEach((icon) => {
			icon.innerText = "volume_up";
		});
		Array.from(this.muteIconText).forEach((icon) => {
			icon.innerText = "UNMUTED";
		});
	}

	setVolume(volume) {
		this.audio.volume = volume;
	}
}

export { AudioManager };
