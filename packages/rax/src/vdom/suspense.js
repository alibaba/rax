import Host from './host';
import BaseComponent from './base';
import instantiateComponent from './instantiateComponent';
import { INSTANCE, INTERNAL, RENDERED_COMPONENT } from '../constant';

/**
 * Suspense Component
 */
class SuspenseComponent extends BaseComponent {
  __mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.__initComponent(parent, parentInstance, context);

    const currentElement = this.__currentElement;
    const publicProps = currentElement.props;
    const type = currentElement.type;

    const { fallback, children } = publicProps;

    const instance = {
      __handleError: this.__handleError
    };

    instance[INTERNAL] = this;
    this[INSTANCE] = instance;

    instance._parent = parent;
    instance.type = type;
    instance.props = publicProps;
    instance.context = context;
    instance.nativeNodeMounter = nativeNodeMounter;

    this[RENDERED_COMPONENT] = instantiateComponent(children);
    this[RENDERED_COMPONENT].__mountComponent(
      this._parent,
      instance,
      context,
      nativeNodeMounter
    );
  }

  __handleError(value) {
    const wakeable = value;
    const { fallback, children } = this.props;

    let showFallback = false;
    if (!this.didSuspend && fallback) {
      showFallback = true;
    }

    wakeable.then((value) => {
      const current = this[RENDERED_COMPONENT];
      let fallbackComponent;

      if (this.didSuspend) {
        fallbackComponent = this[RENDERED_COMPONENT];
      }

      this[RENDERED_COMPONENT] = instantiateComponent(children);
      this[RENDERED_COMPONENT].__mountComponent(
        this._parent,
        this,
        this.context,
        this.nativeNodeMounter
      );

      if (fallbackComponent) {
        fallbackComponent.unmountComponent();
        this.showFallback = false;
      }
    });

    if (showFallback) {
      this[RENDERED_COMPONENT] = instantiateComponent(fallback);
      this[RENDERED_COMPONENT].__mountComponent(
        this._parent,
        this,
        this.context,
        this.nativeNodeMounter
      );
      this.showFallback = true;
      this.didSuspend = true;
    } else {
      // update children
    }
  }

  __updateComponent(
    prevElement,
    nextElement,
    prevUnmaskedContext,
    nextUnmaskedContext
  ) {
    let prevRenderedComponent = this[RENDERED_COMPONENT];
    let prevRenderedElement = prevRenderedComponent.__currentElement;

    prevRenderedComponent.__updateComponent(
      prevElement,
      nextElement,
      prevUnmaskedContext,
      nextUnmaskedContext
    );
  }
}

export default SuspenseComponent;
