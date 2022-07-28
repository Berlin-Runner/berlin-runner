class AudioManager {
  constructor(context) {
    this.context = context;

    this.audioUrl = "./assets/sounds/sound.mp3";
    this.audio = new Audio(this.audioUrl);
    this.isMute = true;

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
