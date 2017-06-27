import * as THREE from 'three';

export default {
  init(props) {
    const {geometry, material} = props;
    const Mesh = new THREE.Mesh(geometry, material);
    Mesh.updateProperty = this.updateProperty;
    return Mesh;
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
