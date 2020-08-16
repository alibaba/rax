import * as THREE from 'three';

export default {
  init(props) {
    const {
      background = null,
      fog = null,
      overrideMaterial = null,
      autoUpdate = true,
      onFrame = () => {}
    } = props;

    const Scene = new THREE.Scene();
    if (fog !== null) {
      if (Object.hasOwnProperty.call(fog, 'density')) {
        Scene.fog = new THREE.FogExp2(fog.color, fog.density);
      } else {
        Scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
      }
    }
    Scene.background = background;
    Scene.overrideMaterial = overrideMaterial;
    Scene.autoUpdate = autoUpdate;
    Scene.onFrame = onFrame;
    Scene.updateProperty = this.updateProperty;
    return Scene;
  },
  updateProperty(key, value) {
    if (key === 'fog') {
      if (Object.hasOwnProperty.call(value, 'density')) {
        this.fog = new THREE.FogExp2(value.color, value.density);
      } else {
        this.fog = new THREE.Fog(value.color, value.near, value.far);
      }
      return;
    }
    if (Object.hasOwnProperty.call(this, key)) {
      if (this[key] && this[key].set) {
        return this[key].set.apply(this[key], Object.values(value));
      }
      this[key] = value;
      return;
    }
  }
};
