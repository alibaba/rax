import * as THREE from 'three';

export default {
  init(props) {
    const {color, intensity} = props;
    const DirectionalLight = new THREE.DirectionalLight(color, intensity);
    DirectionalLight.updateProperty = this.updateProperty;
    return DirectionalLight;
  },
  updateProperty(key, value) {
    if (Object.hasOwnProperty.call(this, key)) {
      if (this[key] && this[key].set) {
        return this[key].set.apply(this[key], Object.values(value));
      }
      this[key] = value;
      return;
    }
  }
};
