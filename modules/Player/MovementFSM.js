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
    this.listenForKeyboardInputs();
    this.listenForSwipeInputs();
  }

  listenForSwipeInputs() {
    let hammertime = new Hammer(document.getElementById("webgl"), {});

    hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

    hammertime.on("swipeleft", (e) => {
      this.moveLeft();
    });

    hammertime.on("swiperight", (e) => {
      this.moveRight();
    });

    hammertime.on("swipeup", (e) => {
      this.jump();
    });
  }

  listenForKeyboardInputs() {
    window.addEventListener("keypress", (e) => {
      switch (e.code) {
        case "KeyA":
          this.moveLeft();
          break;

        case "KeyD":
          this.moveRight();
          break;

        case "Space":
          this.jump();

        default:
          break;
      }
    });
  }

  jump() {
    // TODO
    console.log("must be jumping");
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

  update() {
    // plug in any updates needed here
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++
/* 
  jumpPlayer() {
    let vAngle = 0;
    vAngle += speed;
    player.position.y = Math.sin(vAngle) + 1.38;
  } */

/* setupJumpListner() {
    window.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        this.jumpPlayer(0.05);
      }
    });
  } */
