import * as THREE from 'three';

export default {
  init(props) {
    const {geometry, material} = props;
    const Point = new THREE.Points(geometry, material);
    Point.updateProperty = this.updateProperty;
    return Point;
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
