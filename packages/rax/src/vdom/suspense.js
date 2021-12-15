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
    const type = currentElement.type;

    const instance = {
      __handleError: this.__handleError
    };

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    instance._parent = parent;
    instance.type = type;
    instance.props = publicProps;
    instance.context = context;
    instance.nativeNodeMounter = nativeNodeMounter;

    // Inject the updater into instance
    instance.updater = updater;
    instance[INTERNAL] = this;
    this[INSTANCE] = instance;
    instance.__updateComponent = this.__updateComponent;

    const { children } = publicProps;

    performInSandbox(() => {
      this[RENDERED_COMPONENT] = instantiateComponent(children);
      this[RENDERED_COMPONENT].__mountComponent(
        parent,
        instance,
        context,
        nativeNodeMounter
      );
    }, instance);
  }

  __handleError(instance, value) {
    const wakeable = value;
    const { fallback, children } = instance.props;

    let showFallback = false;
    if (!instance.didSuspend && fallback) {
      showFallback = true;
    }

    wakeable.then((value) => {
      const current = instance[INTERNAL][RENDERED_COMPONENT];
      let fallbackComponent;

      if (
        instance.didSuspend
        && !instance.destroy
      ) {
        fallbackComponent = instance[INTERNAL][RENDERED_COMPONENT];
      }

      performInSandbox(() => {
        if (!instance.initial) {
          instance[INTERNAL][RENDERED_COMPONENT] = instantiateComponent(children);
          instance.initial = true;
          debugger;
          instance[INTERNAL][RENDERED_COMPONENT].__mountComponent(
            instance._parent,
            instance,
            instance.context,
            instance.nativeNodeMounter
          );
        // try {
        //   instance[INTERNAL][RENDERED_COMPONENT] = instantiateComponent(children);
        //   instance.initial = true;
        //   debugger;
        //   instance[INTERNAL][RENDERED_COMPONENT].__mountComponent(
        //     instance._parent,
        //     instance,
        //     instance.context,
        //     instance.nativeNodeMounter
        //   );
        // } catch (error) {
        //   if (error.then) {
        //     instance.__handleError(instance, error);
        //     return;
        //   } else throw error;
          // }
        } else {
          instance[INTERNAL].__updateComponent(current, children, instance.context, instance.context, true);
        }

        if (fallbackComponent) {
          fallbackComponent.unmountComponent();
          instance.destroy = true;
          instance.showFallback = false;
        }
      }, instance);
    });

    if (showFallback) {
      instance[INTERNAL][RENDERED_COMPONENT] = instantiateComponent(fallback);
      instance[INTERNAL][RENDERED_COMPONENT].__mountComponent(
        instance._parent,
        instance,
        instance.context,
        instance.nativeNodeMounter
      );
      instance.showFallback = true;
      instance.didSuspend = true;
    } else {
      // update children
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
    internal
  ) {
    performInSandbox(() => {
      let prevRenderedComponent = this[RENDERED_COMPONENT];
      let prevRenderedElement = prevRenderedComponent.__currentElement;

      // this.__currentElement = nextElement;

      this.__currentElement = nextElement;
      this._context = nextUnmaskedContext;
      const instance = this._instance;

      const nextProps = nextElement.props;

      instance.props = nextProps;
      instance.context = nextUnmaskedContext;

      let element = internal ? nextElement : nextElement.props.children;
      // let element = nextElement;

      if (element && element.$$typeof === Symbol.for('react.lazy')) {
        debugger;
        // try {
        const payload = element._payload;
        const init = element._init;
        element = init(payload);
        // } catch (e) {
        //   debugger;
        //   this.__handleError(this._instance, e);
        // }
      }

      let nextRenderedElement = element;

      prevRenderedComponent.__updateComponent(
        prevRenderedElement,
        nextRenderedElement,
        prevUnmaskedContext,
        nextUnmaskedContext
      );
    }, this._instance);
  }
}

export default SuspenseComponent;
