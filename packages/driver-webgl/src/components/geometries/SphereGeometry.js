import * as THREE from 'three';

export default {
  init(props) {
    const {radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength} = props;
    const SphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    );
    SphereGeometry.updateProperty = this.updateProperty;
    return SphereGeometry;
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
