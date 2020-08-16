import * as THREE from 'three';

export default {
  init(props) {
    const LineDashedMateria = new THREE.LineDashedMateria(props);
    LineDashedMateria.updateProperty = this.updateProperty;
    return LineDashedMateria;
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
