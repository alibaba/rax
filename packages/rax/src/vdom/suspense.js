import Host from './host';
import BaseComponent from './base';
import instantiateComponent from './instantiateComponent';
import { INSTANCE, INTERNAL, RENDERED_COMPONENT } from '../constant';
import updater from './updater';
import performInSandbox from './performInSandbox';
import toArray from '../toArray';

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
    instance.nativeNodeMounter = nativeNodeMounter;
    instance.type = currentElement.type;

    instance.__handleError = this.__handleError;
    instance.__parent = parent;

    const renderedElement = publicProps.children;

    performInSandbox(() => {
      this[RENDERED_COMPONENT] = instantiateComponent(renderedElement);
      this[RENDERED_COMPONENT].__mountComponent(
        parent,
        instance,
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

    console.log('suspense handleError');
    console.log('suspense', instance.props.title);


    wakeable.then((value) => {
      const current = internal[RENDERED_COMPONENT];
      let fallbackComponent;

      if (instance.didSuspend && !instance.destroy) {
        fallbackComponent = internal[RENDERED_COMPONENT];
      }

      performInSandbox(() => {
        if (!instance.initial) {
          let lastNativeNode = null;
          let prevNativeNode = fallbackComponent.__getNativeNode();

          console.log('suspense wakeable');
          console.log('suspense', instance.props.title);

          internal[RENDERED_COMPONENT] = instantiateComponent(children);
          instance.initial = true;
          internal[RENDERED_COMPONENT].__mountComponent(
            instance.__parent,
            instance,
            instance.context,
            (newNativeNode, parent) => {
              const driver = Host.driver;

              prevNativeNode = toArray(prevNativeNode);
              newNativeNode = toArray(newNativeNode);

              // If the new length large then prev
              for (let i = 0; i < newNativeNode.length; i++) {
                let nativeNode = newNativeNode[i];
                if (prevNativeNode[i]) {
                  driver.replaceChild(nativeNode, prevNativeNode[i]);
                } else if (lastNativeNode) {
                  driver.insertAfter(nativeNode, lastNativeNode);
                } else {
                  driver.appendChild(nativeNode, parent);
                }
                lastNativeNode = nativeNode;
              }

              // If the new length less then prev
              for (let i = newNativeNode.length; i < prevNativeNode.length; i++) {
                driver.removeChild(prevNativeNode[i]);
              }
            }
          );

          fallbackComponent.unmountComponent(true);
          instance.destroy = true;
        } else {
          instance.updater.forceUpdate(instance);
          // instance[INTERNAL].__updateComponent(current, children, instance.context, instance.context);
        }

        // if (fallbackComponent) {
        //   fallbackComponent.unmountComponent();
        //   instance.destroy = true;
        // }
      }, instance);
    });

    if (showFallback) {
      let lastNativeNode = null;
      let prevRenderedComponent = this[RENDERED_COMPONENT];
      let prevRenderedElement = prevRenderedComponent ? prevRenderedComponent.__currentElement : null;
      let prevNativeNode = prevRenderedElement ? prevRenderedComponent.__getNativeNode() : null;

      const nodeMounter = (newNativeNode, parent) => {
        const driver = Host.driver;

        prevNativeNode = toArray(prevNativeNode);
        newNativeNode = toArray(newNativeNode);

        // If the new length large then prev
        for (let i = 0; i < newNativeNode.length; i++) {
          let nativeNode = newNativeNode[i];
          if (prevNativeNode[i]) {
            driver.replaceChild(nativeNode, prevNativeNode[i]);
          } else if (lastNativeNode) {
            driver.insertAfter(nativeNode, lastNativeNode);
          } else {
            driver.appendChild(nativeNode, parent);
          }
          lastNativeNode = nativeNode;
        }

        // If the new length less then prev
        for (let i = newNativeNode.length; i < prevNativeNode.length; i++) {
          driver.removeChild(prevNativeNode[i]);
        }
      };

      internal[RENDERED_COMPONENT] = instantiateComponent(fallback);
      internal[RENDERED_COMPONENT].__mountComponent(
        instance.__parent,
        instance,
        instance.context,
        prevRenderedElement ? nodeMounter : instance.nativeNodeMounter
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
