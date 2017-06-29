import * as THREE from 'three';

export default {
  init(props) {
    const MeshBasicMaterial = new THREE.MeshBasicMaterial(props);
    MeshBasicMaterial.updateProperty = this.updateProperty;
    return MeshBasicMaterial;
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
