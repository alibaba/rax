import * as THREE from 'three';

export default {
  init() {
    const Geometry = new THREE.Geometry();
    Geometry.updateProperty = this.updateProperty;
    return Geometry;
  },
  updateProperty(key, value) {
    if (key === 'vertices') {
      this.vertices = value.map((vertex) => new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
      return;
    }
    if (Object.hasOwnProperty.call(this, key)) {
      if (this[key] && this[key].set) {
        return this[key].set.apply(this[key], Object.values(value));
      }
      this[key] = value;
      return;
    }
  },
};
