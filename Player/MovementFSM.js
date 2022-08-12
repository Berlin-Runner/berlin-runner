class MovementFSM {
  constructor(context, player) {
    this.context = context;
    this.player = player;

    this.tweenDuration = 0.75;

    this.lanes = {
      center: 0,
      left: -1,
      right: 1,
    };

    this.currentPlayerLane = this.lanes.center;
    this.listenForInputs();
  }

  listenForInputs() {
    window.addEventListener("keypress", (e) => {
      switch (e.code) {
        case "KeyA":
          this.moveLeft();
          break;

        case "KeyD":
          this.moveRight();
          break;

        default:
          break;
      }
    });
  }

  moveToCenter() {
    gsap.to(this.player.position, { x: 0, duration: this.tweenDuration });
    this.currentPlayerLane = this.lanes.center;
  }

  moveLeft() {
    switch (this.currentPlayerLane) {
      case this.lanes.left:
        break;
      case this.lanes.right:
        this.moveToCenter();
        break;
      case this.lanes.center:
        gsap.to(this.player.position, { x: -2, duration: this.tweenDuration });
        this.currentPlayerLane = this.lanes.left;
        break;
    }
  }

  moveRight() {
    switch (this.currentPlayerLane) {
      case this.lanes.right:
        break;
      case this.lanes.left:
        this.moveToCenter();
        break;
      case this.lanes.center:
        gsap.to(this.player.position, { x: 2, duration: this.tweenDuration });
        this.currentPlayerLane = this.lanes.right;
        break;
    }
  }
}
