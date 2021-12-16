import Host from './host';
import BaseComponent from './base';
import instantiateComponent from './instantiateComponent';
import { INSTANCE, INTERNAL, RENDERED_COMPONENT } from '../constant';
import updater from './updater';
import performInSandbox from './performInSandbox';

/**
 * Suspense Component
 */
class SuspenseComponent extends BaseComponent {
  __mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.__initComponent(parent, parentInstance, context);

    const currentElement = this.__currentElement;
    const publicProps = currentElement.props;

    let instance = this[INSTANCE] = {};
    instance[INTERNAL] = this;

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    instance.props = publicProps;
    instance.context = context;

    // Inject the updater into instance
    instance.updater = updater;
    instance.nativeNodeMounter = nativeNodeMounter;
    instance.type = currentElement.type;
    instance.__handleError = this.__handleError;
    instance.__parent = parent;

    const { children } = publicProps;
    const element = children;

    performInSandbox(() => {
      this[RENDERED_COMPONENT] = instantiateComponent(element);
      this[RENDERED_COMPONENT].__mountComponent(
        parent,
        this[INSTANCE],
        context,
        nativeNodeMounter
      );
    }, instance, (error) => {
      this.__handleError(instance, error);
    });

    return instance;
  }

  __handleError(instance, value) {
    if (!value.then) {
      throw value;
    }

    const wakeable = value;
    const { fallback, children } = instance.props;

    const showFallback = fallback && !instance.didSuspend ? true : false;
    const internal = instance[INTERNAL];

    wakeable.then((value) => {
      const current = internal[RENDERED_COMPONENT];
      let fallbackComponent;

      if (instance.didSuspend && !instance.destroy) {
        fallbackComponent = internal[RENDERED_COMPONENT];
      }

      performInSandbox(() => {
        if (!instance.initial) {
          internal[RENDERED_COMPONENT] = instantiateComponent(children);
          instance.initial = true;
          internal[RENDERED_COMPONENT].__mountComponent(
            instance.__parent,
            instance,
            instance.context,
            instance.nativeNodeMounter
          );
        } else {
          instance.updater.forceUpdate(instance);
          // instance[INTERNAL].__updateComponent(current, children, instance.context, instance.context);
        }

        if (fallbackComponent) {
          fallbackComponent.unmountComponent();
          instance.destroy = true;
        }
      }, instance);
    });

    if (showFallback) {
      internal[RENDERED_COMPONENT] = instantiateComponent(fallback);
      internal[RENDERED_COMPONENT].__mountComponent(
        instance.__parent,
        instance,
        instance.context,
        instance.nativeNodeMounter
      );
      instance.didSuspend = true;
    }
  }

  __getNativeNode() {
    let renderedComponent = this[RENDERED_COMPONENT];
    if (renderedComponent) {
      return renderedComponent.__getNativeNode();
    }
  }

  __updateComponent(
    prevElement,
    nextElement,
    prevUnmaskedContext,
    nextUnmaskedContext,
  ) {
    let instance = this[INSTANCE];

    // Maybe update component that has already been unmounted or failed mount.
    if (!instance) {
      return;
    }

    performInSandbox(() => {
      let prevRenderedComponent = this[RENDERED_COMPONENT];
      let prevRenderedElement = prevRenderedComponent.__currentElement;

      // Replace with next
      this.__currentElement = nextElement;
      this._context = nextUnmaskedContext;
      instance.props = nextElement.props;
      instance.context = nextUnmaskedContext;

      const { children } = nextElement.props || {};
      let nextRenderedElement = children;

      if (children && children.$$typeof === Symbol.for('react.lazy')) {
        const payload = children._payload;
        const init = children._init;
        nextRenderedElement = init(payload);
      }

      prevRenderedComponent.__updateComponent(
        prevRenderedElement,
        nextRenderedElement,
        prevUnmaskedContext,
        nextUnmaskedContext
      );
    }, instance, (error) => {
      this.__handleError(instance, error);
    });
  }
}

export default SuspenseComponent;
