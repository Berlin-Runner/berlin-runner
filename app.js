let isRunning, inLevel;

let camera, scene, renderer, composer, controls;

let player;

let mixer;

let gameStates = {
  notStartedYet: "not_started",
  started: "started",
  inPlay: "in_play",
  paused: "paused",
  over: "game_over",
};

let currentState = gameStates.notStartedYet;

let audio = new Audio("./assets/sound.mp3");
audio.loop = true;
audio.volume = 0.5;
audio.autoplay = true;
console.log(audio);

let page_static = document.getElementById("page_static");
let intro_screen = document.getElementById("intro-screen");
let enter_button = document.getElementById("pressMe");
let level_one_intro_screen = document.getElementById("level-one-intro-screen");
let pause_button = document.getElementById("pause-button");
let pause_screen = document.getElementById("paused-screen");
let pause_restat_button = document.getElementById("restart");
let pause_resume_button = document.getElementById("resume");
let countdown_timer = document.getElementById("countdown-timer");
let restart_button = document.getElementById("restart-game");
let game_over_screen = document.getElementById("game-over-screen");
let final_score = document.getElementById("final-score");

let muteIcons = document.getElementsByClassName("mute-icon");
console.log(muteIcons);
let muteIconText = document.getElementsByClassName("mute-icon-text");

let isMute = false;

document.addEventListener("keypress", (e) => {
  if (e.code === "KeyM") {
    if (isMute) {
      audio.pause();
      isMute = !isMute;
      Array.from(muteIcons).forEach((icon) => {
        icon.innerText = "volume_off";
      });
      Array.from(muteIconText).forEach((icon) => {
        icon.innerText = "MUTED";
      });
    } else {
      isMute = !isMute;
      audio.play();
      Array.from(muteIcons).forEach((icon) => {
        icon.innerText = "volume_up";
      });
      Array.from(muteIconText).forEach((icon) => {
        icon.innerText = "UNMUTED";
      });
    }
  }
});

let shaderUniforms = {
  shiftParamaters: {
    yShiftTreshold: -0.00125,
    zShiftTreshold: 0.0001,
  },
};

//#region shader/material implementation

const foldableShader = `
  vec4 vWorld = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  vWorld -= cameraPosition.y;
  vec3 vShift = vec3(.0, pow2(vWorld.z) * - .00125, pow2(vWorld.z) * .00001 * 0.0001);

  transformed += vShift;
`;

function FoldableMaterial(options = {}) {
  return THREE.extendMaterial(THREE.MeshStandardMaterial, {
    class: THREE.CustomMaterial,

    material: { ...options },

    vertex: {
      transformEnd: foldableShader,
    },
  });
}

//#endregion

const textures = {
  sky: new THREE.TextureLoader().load("/textures/sky.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  }),
};

//#region helper functions
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//#endregion

const loader = new THREE.GLTFLoader();

async function loadModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        let result = { model: gltf.scene, animations: gltf.animations };
        resolve(result);
      },
      (e) => {
        // console.log("LOADING THE RESOURCE");
      },
      (err) => {
        console.log(err);
      }
    );
  });
}

//#region player related stuff
async function loadPlayerModel() {
  let { model, animations } = await loadModel("/assets/box_man.glb");

  return { model, animations };
}

let runAction, stopAction, deadAction;
let runClip, haltClip, deadClip;

async function addPlayerMesh() {
  player = new THREE.Group();
  let playerModelFull = await loadPlayerModel();

  let playerMesh = playerModelFull.model;
  let playerAnimation = playerModelFull.animations;

  mixer = new THREE.AnimationMixer(playerMesh);
  let clips = playerAnimation;

  player.add(playerMesh);
  player.rotation.set(0, Math.PI, 0);
  player.scale.setScalar(1);

  playerMesh.traverse((child) => {
    if (child.isMesh) {
      child.material.color = new THREE.Color("#f00");
    }
  });

  player.addEventListener("collide", () => {
    "THE PLAYER HAS COLLIDED";
  });

  console.log(clips);

  runClip = THREE.AnimationClip.findByName(clips, "run");
  haltClip = THREE.AnimationClip.findByName(clips, "idle");
  deadClip = THREE.AnimationClip.findByName(clips, "falling");

  runAction = mixer.clipAction(runClip);
  stopAction = mixer.clipAction(haltClip);
  deadAction = mixer.clipAction(deadClip);
  deadAction.setLoop(THREE.LoopOnce);

  runAction.play();

  scene.add(player);
}

function movePlayer() {
  window.addEventListener("keypress", (e) => {
    switch (e.code) {
      case "KeyA":
        gsap.to(player.position, { x: -2, duration: 0.5 });
        break;

      case "KeyD":
        gsap.to(player.position, { x: 2, duration: 0.5 });
        break;

      case "KeyS":
        gsap.to(player.position, { x: 0, duration: 0.5 });
        break;

      default:
        break;
    }
  });
}

//#endregion

function moveCamera() {
  camera.position.x = player.position.x;
  camera.position.y = player.position.y + 1.5;
  camera.position.z = player.position.z + 4.5;
  camera.lookAt(player.position);
}

function jump(speed) {
  let vAngle = 0;
  vAngle += speed;
  player.position.y = Math.sin(vAngle) + 1.38;
}
function jumpOnSpace() {
  window.addEventListener("keypress", (e) => {
    if (e.code === "Space") {
      jump(0.05);
    }
  });
}

let first_lanscape = undefined;

async function loadLandscape() {
  let { model } = await loadModel("/assets/landscape_2.glb");

  return model.children[0];
}

function startGame() {
  console.log("SWITCHING GAME STATE TO PLAYING");
  // hide loader stuff,
  currentState = gameStates.inPlay;
}

function gameOver() {
  audio.volume = 0.25;
  runAction.crossFadeTo(deadAction, 1, true).play();
  runAction.stop();
  stopAction.crossFadeFrom(deadAction, 0.25, true).play();
  deadAction.stop();
  currentState = gameStates.over;
  setTimeout(() => {
    game_over_screen.style.display = "flex";
    page_static.style.display = "flex";
    final_score.innerText = currentScore;
    currentScore = 0;
  }, 1.25 * 1000);
}

let model,
  coinGroup,
  z,
  scoreText,
  currentScore,
  coinPositionsX,
  coinPositionsY;

async function createWorld() {
  jumpOnSpace();

  z = 0;

  model = await loadLandscape();
  let lanscapeMap = model.material.map;
  model.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
    class: THREE.CustomMaterial,

    vertex: {
      transformEnd: foldableShader,
    },
  });

  model.material.uniforms.map.value = lanscapeMap;
  model.material.map = lanscapeMap;

  addPlayerMesh();
  movePlayer();

  let coinGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16);
  // let coinGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  let coinMaterial = THREE.extendMaterial(THREE.MeshStandardMaterial, {
    class: THREE.CustomMaterial,

    vertex: {
      transformEnd: foldableShader,
    },
  });

  coinMaterial.uniforms.diffuse.value = new THREE.Color("yellow");

  let coin = new THREE.Mesh(coinGeo, coinMaterial);
  coin.rotation.set(90 * (Math.PI / 180), 0, 0);

  coinPositionsX = [-2, 0, 2];
  coinPositionsY = [0.75, 1.5];

  coinGroup = new THREE.Group();

  for (let i = 0; i < 4; i++) {
    let coinClone = coin.clone();
    coinClone.position.z = i * 1.25;
    coinGroup.add(coinClone);
  }

  scoreText = document.getElementById("score_text");
  currentScore = 0;

  let runGame = true;

  console.log("GAMESTATE");
}

async function scoreLoop() {
  while (currentState == gameStates.inPlay) {
    if (scoreText) {
      currentScore += 1;
      scoreText.innerText = currentScore;

      if (currentScore > 10) {
        currentState = gameStates.over;
        gameOver();
      }
    }

    await this.sleep(2.5 * 1000);
  }
}

async function gameLoop() {
  while (currentState === gameStates.inPlay) {
    console.log("generating stuff");
    let loadLandscapeClone = model.clone();
    loadLandscapeClone.position.z = z;
    scene.add(loadLandscapeClone);
    z -= 36.75;

    if (randomIntFromInterval(0, 1)) {
      let coinToPlace = coinGroup.clone();
      coinToPlace.position.z = z;
      coinToPlace.position.y = 1;
      coinToPlace.position.x = coinPositionsX[randomIntFromInterval(0, 2)];
      coinToPlace.position.y = coinPositionsY[randomIntFromInterval(0, 1)];
      scene.add(coinToPlace);
    }

    await this.sleep(0.25 * 1000);
  }
}

function init() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000.0
  );

  scene = new THREE.Scene();
  scene.background = textures.sky;

  const near = 0.1;
  const far = 100;
  const color = "#ccc";
  scene.fog = new THREE.Fog(color, near, far);

  let canvas = document.getElementById("webgl");

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  composer = new THREE.EffectComposer(renderer);

  let ambLight = new THREE.AmbientLight("#fff", 0.5);
  scene.add(ambLight);

  let moonLight = new THREE.DirectionalLight("#fff", 1.75);
  moonLight.position.set(0, 0.1, 0);

  scene.add(moonLight);

  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(new THREE.RenderPass(scene, camera));
  composer.addPass(
    new THREE.BokehPass(scene, camera, {
      focus: 5,
      aperture: 0.9,
      maxblur: 0.005,
      width: window.innerWidth,
      height: window.innerHeight,
    })
  );

  let countDownTimer = 3;
  let level_one_coundown_intervalID;

  createWorld();

  enter_button.addEventListener("click", () => {
    intro_screen.style.display = "none";
    game_over_screen.style.display = "none";
    pause_screen.style.display = "none";
    currentState = gameStates.started;
    level_one_coundown_intervalID = setInterval(() => {
      countdown_timer.innerText = countDownTimer;
      countDownTimer--;
    }, 1 * 1000);

    audio.volume = 0.6;
    setTimeout(() => {
      clearInterval(level_one_coundown_intervalID);
      currentState = gameStates.inPlay;
      level_one_intro_screen.style.display = "none";
      page_static.style.display = "none";
      audio.volume = 0.8;
      gameLoop();
      scoreLoop();
    }, 3 * 1000);
  });

  pause_button.addEventListener("click", () => {
    audio.volume = 0.5;
    pause_screen.style.display = "flex";
    page_static.style.display = "flex";
    runAction.crossFadeTo(stopAction, 0.5, false).play();
    runAction.stop();
    currentState = gameStates.paused;
  });

  pause_resume_button.addEventListener("click", () => {
    audio.volume = 0.8;
    pause_screen.style.display = "none";
    page_static.style.display = "none";
    currentState = gameStates.inPlay;
    stopAction.stop();
    // runAction.play();
    runAction.crossFadeFrom(stopAction, 0.25, true).play();
    scoreLoop();
    gameLoop();
  });

  pause_restat_button.addEventListener("click", () => {
    audio.volume = 0.4;
    pause_screen.style.display = "none";
    page_static.style.display = "flex";
    level_one_intro_screen.style.display = "flex";

    currentState = gameStates.started;
    countdown_timer.innerText = ":(";
    countDownTimer = 3;

    level_one_coundown_intervalID = setInterval(() => {
      countdown_timer.innerText = countDownTimer;
      countDownTimer--;
    }, 1 * 1000);

    setTimeout(() => {
      audio.volume = 0.8;
      clearInterval(level_one_coundown_intervalID);
      level_one_intro_screen.style.display = "none";
      page_static.style.display = "none";
      currentScore = 0;

      runAction.crossFadeFrom(stopAction, 0.25, false).play();
      stopAction.stop();
      currentState = gameStates.inPlay;

      gameLoop();
      scoreLoop();
    }, 3 * 1000);
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      // make the paused screen appear
      // change the state
    }
  });

  restart_button.addEventListener("click", () => {
    audio.volume = 0.8;
    page_static.style.display = "none";
    game_over_screen.style.display = "none";
    pause_screen.style.display = "none";
    runAction.crossFadeFrom(stopAction, 0.25, false).play();
    stopAction.stop();
    currentState = gameStates.inPlay;
    gameLoop();
    scoreLoop();
  });
  // gameLoop();

  // document.body.appendChild(renderer.domElement);
}

let time = new THREE.Clock();

let acceleration = 9.8;
let bounce_distance = 1.25;
let bottom_position_y = 0;
let time_step = 0.03;
// time_counter is calculated to be the time the ball just reached the top position
// this is simply calculated with the s = (1/2)gt*t formula, which is the case when ball is dropped from the top position
let time_counter = Math.sqrt((bounce_distance * 2) / acceleration);
let initial_speed = acceleration * time_counter;

let jumpUp = false;
window.addEventListener("keypress", (e) => {
  if (e.code === "Space") {
    jumpUp = true;
  }
});

function animate() {
  requestAnimationFrame(animate);

  // gameLoop();

  if (player && currentState === gameStates.inPlay) player.position.z -= 0.25;

  if (player) {
    if (player.position.y < bottom_position_y) {
      time_counter = 0;
    }

    if (!player.position.y == bottom_position_y) {
      player.position.y =
        bottom_position_y +
        initial_speed * time_counter -
        0.5 * acceleration * time_counter * time_counter;
      // advance time
      time_counter += time_step;
    }
  }

  if (player && camera) moveCamera();
  if (mixer) mixer.update(time.getDelta());

  composer.render();
}

init();
animate();
