import * as THREE from 'three';

export default {
  init(props) {
    const {color, intensity} = props;
    const AmbientLight = new THREE.AmbientLight(color, intensity);
    AmbientLight.updateProperty = this.updateProperty;
    return AmbientLight;
  },
  updateProperty(key, value) {
    if (Object.hasOwnProperty.call(this, key)) {
      if (this[key] && this[key].set) {
        return this[key].set.apply(this[key], Object.values(value));
      }
      this[key] = value;
      return;
    }
  },
};
