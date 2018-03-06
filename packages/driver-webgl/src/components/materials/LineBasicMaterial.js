import * as THREE from 'three';

export default {
  init(props) {
    const LineBasicMaterial = new THREE.LineBasicMaterial(props);
    LineBasicMaterial.updateProperty = this.updateProperty;
    return LineBasicMaterial;
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
