import * as THREE from 'three';

export default {
  init(props) {
    const {fov, aspect, near, far} = props;
    const PerspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    PerspectiveCamera.updateProperty = this.updateProperty;
    return PerspectiveCamera;
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
