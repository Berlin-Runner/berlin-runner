import {
  Vec3,
  World,
  SplitSolver,
  Material,
  ContactMaterial,
  Body,
  Plane,
  GSSolver,
  Sphere,
  Box,
} from "../../libs/cannon-es.js";
class MovementFSM {
  constructor(context, player) {
    this.context = context;
    this.player = player;

    this.tweenDuration = 0.75;

    this.canJump = true;
    this.jumpVelocity = 6;

    this.lanes = {
      center: 0,
      left: -1,
      right: 1,
    };

    this.settings = {
      worldAllowSleep: true,
      useSplitSolver: false,

      gravity: new THREE.Vector3(0, -9.8, 0),

      globalContactMaterial: {
        friction: 0.1,
        restitution: 0.3,
      },

      playerColliderRadius: 0.6,
      playerColliderMass: 1,
      // playerInitialPosition: new Vec3(-2, 20, 20),
      playerInitialPosition: new Vec3(0, 0, 0),
      playerLinearDampeneingFactor: 0.95,
    };

    this.currentPlayerLane = this.lanes.center;

    this.initCharachterCollider();

    this.cannonBody = this.context.sphereBody;
    this.setupEventListners();

    this.velocity = this.context.sphereBody.velocity;

    this.listenForKeyboardInputs();
    this.listenForSwipeInputs();
  }

  initCharachterCollider() {
    const size = 1;
    const halfExtents = new Vec3(size / 4, size / 2, size / 4);
    const boxShape = new Box(halfExtents);
    const boxBody = new Body({ mass: 1, shape: boxShape });
    this.radius = this.settings.playerColliderRadius;
    this.sphereShape = new Sphere(this.radius);
    this.context.sphereBody = new Body({
      mass: this.settings.playerColliderMass,
      material: this.physicsMaterial,
    });
    this.context.sphereBody.addShape(boxShape);
    this.context.sphereBody.position = this.settings.playerInitialPosition;
    this.context.sphereBody.linearDamping =
      this.settings.playerLinearDampeneingFactor;
    this.context.sphereBody.allowSleep = false;
    this.context.world.addBody(this.context.sphereBody);
  }

  setupEventListners() {
    const contactNormal = new Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    const upAxis = new Vec3(0, 1, 0);
    this.cannonBody.addEventListener("collide", (event) => {
      const { contact } = event;

      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if (contact.bi.id === this.cannonBody.id) {
        // bi is the player body, flip the contact normal
        contact.ni.negate(contactNormal);
      } else {
        // bi is something else. Keep the normal as it is
        contactNormal.copy(contact.ni);
      }

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (contactNormal.dot(upAxis) > 0.5) {
        console.log("collision is heard");
        // Use a "good" threshold value between 0 and 1 here!
        this.canJump = true;
      }
    });
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
          break;

        default:
          break;
      }
    });
  }

  jump() {
    // TODO
    if (this.canJump) {
      console.log("jumping");
      this.velocity.y = this.jumpVelocity;
    }
    this.canJump = false;
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

  updatePlayerColliderPosition() {
    this.context.sphereBody.position.x =
      this.context.playerInstance.player.position.x;

    this.context.playerInstance.player.position.y =
      this.context.sphereBody.position.y - 0.5;
    this.context.sphereBody.position.z =
      this.context.playerInstance.player.position.z;
  }

  update() {
    this.updatePlayerColliderPosition();
    if (this.velocity.y < 0.75) this.canJump = true;
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

export { MovementFSM };
