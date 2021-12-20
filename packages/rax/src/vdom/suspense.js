import BaseComponent from './base';
import instantiateComponent from './instantiateComponent';
import { INSTANCE, INTERNAL, RENDERED_COMPONENT } from '../constant';
import updater from './updater';
import performInSandbox from './performInSandbox';
import getNewNativeNodeMounter from './getNewNativeNodeMounter';

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

    instance.props = publicProps;
    instance.context = context;
    instance.updater = updater;
    instance.type = currentElement.type;

    instance.__handleError = this.__handleError;
    instance.__parent = parent;

    this.__nativeNodeMounter = nativeNodeMounter;

    const renderedElement = publicProps.children;

    performInSandbox(() => {
      const renderedComponent = instantiateComponent(renderedElement);
      renderedComponent.__mountComponent(
        parent,
        instance,
        context,
        nativeNodeMounter
      );

      if (this.__showFallback) {
        // component render error will be catch by sandbox，so need to unmount the broken component here.
        renderedComponent.unmountComponent(true);
      } else {
        this[RENDERED_COMPONENT] = renderedComponent;
      }
    }, instance, (error) => {
      this.__handleError(instance, error);
    });

    return instance;
  }

  __handleError(instance, value) {
    if (!value.then) {
      throw value;
    }

    const { fallback, children } = instance.props;
    const internal = instance[INTERNAL];

    const wakeable = value;
    wakeable.then(() => {
      performInSandbox(() => {
        if (!instance.didSuspend) {
          const prevRenderedComponent = internal[RENDERED_COMPONENT];
          internal.__mountRenderedComponent(children);
          prevRenderedComponent.unmountComponent(true);

          instance.didSuspend = true;
        } else {
          instance.updater.forceUpdate(instance);
        }
      }, instance, (error) => {
        this.__handleError(instance, error);
      });
    });

    if (!instance.didSuspend) {
      internal.__mountRenderedComponent(fallback);
      internal.__showFallback = true;
    }
  }

  __mountRenderedComponent(component) {
    const prevRenderedComponent = this[RENDERED_COMPONENT];

    let nativeNodeMounter = this[INSTANCE].nativeNodeMounter;

    if (prevRenderedComponent && prevRenderedComponent.__currentElement) {
      const prevNativeNode = prevRenderedComponent.__getNativeNode();
      nativeNodeMounter = getNewNativeNodeMounter(prevNativeNode);
    }

    this[RENDERED_COMPONENT] = instantiateComponent(component);
    this[RENDERED_COMPONENT].__mountComponent(
      this._parent,
      this[INSTANCE],
      this._context,
      nativeNodeMounter
    );
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
