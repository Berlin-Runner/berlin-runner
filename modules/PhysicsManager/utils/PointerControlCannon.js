// import * as THREE from "three";
// import { EventDispatcher, Object3D, Quaternion, Euler, Vector3 } from "three";
import { Vec3 } from "../../../libs/cannon-es.js";

/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
class PointerLockControlsCannon extends EventDispatcher {
  constructor(camera, cannonBody, context) {
    super();

    this.context = context;

    this.settings = {
      enabled: true,
      velocityFactor: 20,
      jumpVelocity: 6,
      canJump: true,
      yawFactor: 0.001,
      pitchFactor: 0.001,
    };

    this.enabled = this.settings.enabled;

    this.cannonBody = cannonBody;

    // var eyeYPos = 2 // eyes are 2 meters above the ground
    this.velocityFactor = this.settings.velocityFactor;
    this.jumpVelocity = this.settings.jumpVelocity;

    this.pitchObject = new Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new Object3D();
    this.yawObject.position.y = 0;
    this.yawObject.add(this.pitchObject);

    this.quaternion = new Quaternion();

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.canJump = this.settings.canJump;

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
        // Use a "good" threshold value between 0 and 1 here!
        this.canJump = true;
      }
    });

    this.context.debugLog.logInfo("THE CAMERA COLLIDER IS", false);
    this.context.debugLog.logInfo(this.cannonBody, false);

    this.velocity = this.cannonBody.velocity;

    // Moves the camera to the js object position and adds velocity to the object if the run key is down
    this.inputVelocity = new Vector3();
    this.euler = new Euler();

    this.lockEvent = { type: "lock" };
    this.unlockEvent = { type: "unlock" };

    this.connect();

    this.addClassSettings();
  }

  connect() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("pointerlockchange", this.onPointerlockChange);
    document.addEventListener("pointerlockerror", this.onPointerlockError);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  disconnect() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("pointerlockchange", this.onPointerlockChange);
    document.removeEventListener("pointerlockerror", this.onPointerlockError);
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }

  dispose() {
    this.disconnect();
  }

  lock() {
    document.body.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  onPointerlockChange = () => {
    if (document.pointerLockElement) {
      this.dispatchEvent(this.lockEvent);

      this.isLocked = true;
    } else {
      this.dispatchEvent(this.unlockEvent);

      this.isLocked = false;
    }
  };

  onPointerlockError = () => {
    console.error("PointerLockControlsCannon: Unable to use Pointer Lock API");
  };

  onMouseMove = (event) => {
    if (!this.enabled) {
      return;
    }

    const { movementX, movementY } = event;

    this.yawObject.rotation.y -= movementX * this.settings.yawFactor;
    this.pitchObject.rotation.x -= movementY * this.settings.pitchFactor;

    this.pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.pitchObject.rotation.x)
    );
  };

  onKeyDown = (event) => {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.moveForward = true;
        break;

      case "KeyA":
      case "ArrowLeft":
        this.moveLeft = true;
        break;

      case "KeyS":
      case "ArrowDown":
        this.moveBackward = true;
        break;

      case "KeyD":
      case "ArrowRight":
        this.moveRight = true;
        break;

      case "Space":
        if (this.canJump) {
          this.velocity.y = this.jumpVelocity;
        }
        this.canJump = false;
        break;
    }
  };

  onKeyUp = (event) => {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.moveForward = false;
        break;

      case "KeyA":
      case "ArrowLeft":
        this.moveLeft = false;
        break;

      case "KeyS":
      case "ArrowDown":
        this.moveBackward = false;
        break;

      case "KeyD":
      case "ArrowRight":
        this.moveRight = false;
        break;
    }
  };

  getObject() {
    return this.yawObject;
    // return this.pitchObject;
  }

  getDirection() {
    const vector = new Vec3(0, 0, -1);
    vector.applyQuaternion(this.quaternion);
    return vector;
  }

  update(delta) {
    if (this.enabled === false) {
      return;
    }

    this.inputVelocity.set(0, 0, 0);

    if (this.moveForward) {
      this.inputVelocity.z = -this.velocityFactor * delta;
    }
    if (this.moveBackward) {
      this.inputVelocity.z = this.velocityFactor * delta;
    }

    if (this.moveLeft) {
      this.inputVelocity.x = -this.velocityFactor * delta;
    }
    if (this.moveRight) {
      this.inputVelocity.x = this.velocityFactor * delta;
    }

    // Convert velocity to world coordinates
    this.euler.x = this.pitchObject.rotation.x;
    this.euler.y = this.yawObject.rotation.y;
    this.euler.order = "XYZ";
    this.quaternion.setFromEuler(this.euler);
    this.inputVelocity.applyQuaternion(this.quaternion);

    // Add to the object
    this.velocity.x += this.inputVelocity.x;
    this.velocity.z += this.inputVelocity.z;

    // console.log(this.velocity);

    this.yawObject.position.copy(this.cannonBody.position);
  }

  addClassSettings() {
    /*
      enabled: true,
      velocityFactor: 20,
      jumpVelocity: 6,
      canJump: true,
      yawFactor: 0.001,
      pitchFactor: 0.001,
    */

    let localSettings = this.context.gui.addFolder(
      "POINTER CONTROL(PHYSICS) PROPERTIES"
    );

    localSettings
      .add(this.settings, "enabled")
      .onChange((value) => {
        this.enabled = value;
      })
      .name("Enabled");

    localSettings
      .add(this.settings, "velocityFactor", 10, 50, 0.25)
      .onChange((value) => {
        this.velocityFactor = value;
      });

    localSettings
      .add(this.settings, "jumpVelocity", 4, 15, 0.25)
      .onChange((value) => {
        this.jumpVelocity = value;
      });

    localSettings
      .add(this.settings, "canJump")
      .onChange((value) => {
        this.canJump = value;
      })
      .name("CanJump");

    localSettings
      .add(this.settings, "yawFactor", 0, 0.005, 0.000025)
      .onChange((value) => {
        this.yawFactor = value;
      });

    localSettings
      .add(this.settings, "pitchFactor", 0, 0.005, 0.000025)
      .onChange((value) => {
        this.pitchFactor = value;
      });
  }
}

export { PointerLockControlsCannon };
