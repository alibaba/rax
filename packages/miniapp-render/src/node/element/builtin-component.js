import Element from '../element';
import cache from '../../utils/cache';

class BuiltInComponent extends Element {
  // Create instance
  static _create(options, tree) {
    return new BuiltInComponent(options, tree);
  }

  // Override the parent class's recovery instance method
  _recycle() {
    this._destroy();
  }

  get _behavior() {
    return this._attrs.get('_behavior') || '';
  }

  set _behavior(value) {
    if (typeof value !== 'string') return;

    this._attrs.set('_behavior', value);
  }


  get scrollTop() {
    return this._attrs.get('scroll-top') || 0;
  }

  set scrollTop(value) {
    value = parseInt(value, 10);

    if (!isNaN(value)) {
      this._attrs.set('scroll-top', value);
    }
  }

  get scrollLeft() {
    return this._attrs.get('scroll-left') || 0;
  }

  set scrollLeft(value) {
    value = parseInt(value, 10);

    if (!isNaN(value)) {
      this._attrs.set('scroll-left', value);
    }
  }
}

export default BuiltInComponent;
