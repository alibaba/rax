import * as THREE from 'three';

export default {
  init() {
    const Object3D = new THREE.Object3D();
    Object3D.updateProperty = this.updateProperty;
    return Object3D;
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
