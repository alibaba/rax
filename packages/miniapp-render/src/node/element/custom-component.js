import Element from '../element';

class CustomComponent extends Element {
  // Create instance
  static $$create(options, tree) {
    return new CustomComponent(options, tree);
  }

  $$init(options, tree) {
    this.$_behavior = options.componentName;

    super.$$init(options, tree);
  }

  $$destroy() {
    super.$$destroy();

    this.$_behavior = null;
  }

  $$recycle() {
    this.$$destroy();
  }

  get behavior() {
    return this.$_behavior;
  }
}

export default CustomComponent;
