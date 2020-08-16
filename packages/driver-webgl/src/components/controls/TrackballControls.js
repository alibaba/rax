import * as THREE from 'three';

export default {
  init(props) {
    const {camera} = props;
    const TrackballControls = new THREE.TrackballControls(camera);
    TrackballControls.updateProperty = this.updateProperty;
    return TrackballControls;
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
