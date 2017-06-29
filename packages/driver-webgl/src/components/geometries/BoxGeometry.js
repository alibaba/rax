import * as THREE from 'three';

export default {
  init(props) {
    const {width, height, depth, widthSegments, heightSegments, depthSegments} = props;
    const BoxGeometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments
    );
    BoxGeometry.updateProperty = this.updateProperty;
    return BoxGeometry;
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
