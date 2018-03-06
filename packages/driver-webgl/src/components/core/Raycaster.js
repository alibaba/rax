import * as THREE from 'three';

let camera = null;

export default {
  init(props) {
    const {origin, direction, near, far} = props;
    const Raycaster = new THREE.Raycaster(origin, direction, near, far);
    Raycaster.updateProperty = this.updateProperty;
    camera = props.camera;
    return Raycaster;
  },
  updateProperty(key, value) {
    if (key === 'camera') {
      camera = value;
    }
    if (key === 'coords') {
      this.setFromCamera(value, camera);
    }
  }
};
