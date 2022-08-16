class Camer3rdPerson {
  constructor(context, player) {
    this.context = context;
    this.camera = this.context.gameWorld.camera;
    this.player = player;

    this.time = new THREE.Clock();
  }

  update() {
    if (!this.camera || !this.player) return;
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + 2.25;
    this.camera.position.z = this.player.position.z + 4.5;
    // this.camera.lookAt(this.player.position);
    // console.log("updating the camera");
    // this.camera.position.z += 100 * Math.sin(this.time.getDelta() * 0.01);
    // console.log(Math.sin(this.time.getDelta()));
  }
}
