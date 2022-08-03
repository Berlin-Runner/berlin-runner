class Landscape {
  constructor(name) {
    this.name = name;
  }

  async loadLandscape(url) {
    let { model } = await UTIL.loadModel(url);

    return model.children[0];
  }

  async initLandscape(url) {
    let model = await this.loadLandscape(url);
    let lanscapeMap = model.material.map;

    model.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
      class: THREE.CustomMaterial,

      vertex: {
        transformEnd: UTIL.getFoldableShader(),
      },
    });

    model.material.uniforms.map.value = lanscapeMap;

    model.material.map = lanscapeMap;

    return model;
  }
}
