import BaseComponent from './base';
import instantiateComponent from './instantiateComponent';
import { INSTANCE, INTERNAL, RENDERED_COMPONENT, LAZY_TYPE } from '../constant';
import updater from './updater';
import performInSandbox from './performInSandbox';
import getNewNativeNodeMounter from './getNewNativeNodeMounter';
import shouldUpdateComponent from './shouldUpdateComponent';

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
    instance.nativeNodeMounter = nativeNodeMounter;

    instance.__handleError = this.__handleError;

    performInSandbox(() => {
      const renderedElement = publicProps.children;
      const renderedComponent = instantiateComponent(renderedElement);
      renderedComponent.__mountComponent(
        parent,
        instance,
        context,
        nativeNodeMounter
      );

      if (this.__didCapture) {
        // Unmount the broken component.
        // Component render error will be caught by sandbox.
        renderedComponent.unmountComponent(true);
      } else {
        this[RENDERED_COMPONENT] = renderedComponent;
      }
    }, instance, (error) => {
      this.__handleError(instance, error);
    });

    return instance;
  }

  __handleError(instance, error) {
    if (!error.then) {
      throw error;
    }

    const { fallback, children } = instance.props;
    const internal = instance[INTERNAL];

    const wakeable = error;
    wakeable.then(() => {
      performInSandbox(() => {
        if (!instance.__didMount) {
          const prevRenderedComponent = internal[RENDERED_COMPONENT];
          internal.__mountRenderedComponent(children);
          prevRenderedComponent.unmountComponent(true);

          instance.__didMount = true;
        } else {
          instance.updater.forceUpdate(instance);
        }
      }, instance, (e) => {
        instance.__handleError(instance, e);
      });
    });

    if (!internal.__didCapture && !instance.__didMount) {
      internal.__mountRenderedComponent(fallback);
      internal.__didCapture = true;
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

      if (children && children.$$typeof === LAZY_TYPE) {
        const payload = children._payload;
        const init = children._init;
        nextRenderedElement = init(payload);
      }

      if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
        prevRenderedComponent.__updateComponent(
          prevRenderedElement,
          nextRenderedElement,
          prevUnmaskedContext,
          nextUnmaskedContext
        );
      } else {
        prevRenderedComponent.unmountComponent(true);
        this.__mountRenderedComponent(nextRenderedElement);
      }
    }, instance, (error) => {
      this.__handleError(instance, error);
    });
  }
}

export default SuspenseComponent;
