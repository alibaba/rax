import * as THREE from 'three';

export default {
  init(props) {
    const MeshPhongMaterial = new THREE.MeshPhongMaterial(props);
    MeshPhongMaterial.updateProperty = this.updateProperty;
    return MeshPhongMaterial;
  },
  updateProperty(key, value) {
    if (key === 'map') {
      const map = new THREE.TextureLoader().load(value.src);
      this.map = map;
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
