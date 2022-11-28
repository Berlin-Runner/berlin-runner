class AudioManager {
	constructor(context) {
		this.context = context;

		this.muteIcons = document.getElementsByClassName("mute-icon");
		this.muteIconText = document.getElementsByClassName("mute-icon-text");

		this.init();
		this.setupMuteListener();
	}

	init() {
		this.audioSources = [];
		this.setupEventSubscriptions();
	}

	setupEventSubscriptions() {}

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
		this.isMute = !this.isMute;
		Array.from(this.muteIcons).forEach((icon) => {
			icon.innerText = "volume_off";
		});
		Array.from(this.muteIconText).forEach((icon) => {
			icon.innerText = "MUTED";
		});

		if (this.audioSources.length > 0) {
			console.log("muting things");
			this.audioSources.forEach((audioSource) => {
				console.log(audioSource);
				audioSource.sound.muted = true;
			});
		}

		// do the actual mute and unmuting =)
	}

	unmuteAudio() {
		this.isMute = !this.isMute;
		Array.from(this.muteIcons).forEach((icon) => {
			icon.innerText = "volume_up";
		});
		Array.from(this.muteIconText).forEach((icon) => {
			icon.innerText = "UNMUTED";
		});

		if (this.audioSources.length > 0) {
			this.audioSources.forEach((audioSource) => {
				audioSource.sound.muted = false;
			});
		}
		// do the actual mute and unmuting =)
	}

	setVolume(volume) {
		this.audio.volume = volume;
	}
}

export { AudioManager };
