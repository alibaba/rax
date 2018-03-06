import * as THREE from 'three';

export default {
  init(props) {
    const BufferGeometry = new THREE.BufferGeometry();
    BufferGeometry.updateProperty = this.updateProperty;
    Object.keys(props).forEach((key) => {
      const item = props[key];
      const {array, itemSize, normalized} = item;
      const bufferAttribute = new THREE.BufferAttribute(array, itemSize, normalized);
      BufferGeometry.addAttribute(key, bufferAttribute);
    });
    BufferGeometry.computeBoundingSphere();
    return BufferGeometry;
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
