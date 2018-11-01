import computeChangedData from './computeChangedData';

function getSlotName(item) {
  if (item && Object.hasOwnProperty.call(item, 'props')) {
    return item.props.slot || 'default';
  } else {
    return 'default';
  }
}

function injectSlot(child, $slots) {
  if (null == child) return;
  const slotName = getSlotName(child);
  if (null == slotName) return;
  $slots[slotName] = $slots[slotName] || [];
  $slots[slotName].push(child);
}

export default function createComponent(renderFactory, render, config) {
  const templateRender = renderFactory(render);

  return class extends render.Component {
    constructor() {
      super();
      this.state = { ...config.data };
      this.publicInstance = this._createPublicInstance();
    }

    static defaultProps = config.props;

    _createPublicInstance() {
      const scope = {};

      if (config.methods != null) {
        for (let key in config.methods) {
          if (Object.prototype.hasOwnProperty.call(config.methods, key)) {
            scope[key] = config.methods[key].bind(scope);
          }
        }
      }

      Object.defineProperty(scope, 'props', {
        get: () => this.props,
      });
      Object.defineProperty(scope, 'data', {
        get: () => this.state,
      });

      Object.defineProperty(scope, 'setData', {
        get: () => this.setData,
      });

      Object.defineProperty(scope, '$slots', {
        get: () => this.transformChildrenToSlots(this.props.children),
      });

      return scope;
    }

    setData = (data, callback) => {
      if (data == null) return;
      this.setState(computeChangedData(this.data, data), callback);
    };

    transformChildrenToSlots = (children) => {
      const $slots = {};
      if (Array.isArray(children)) {
        for (let i = 0, l = children.length; i < l; i++) {
          injectSlot(children[i], $slots);
        }
      } else {
        injectSlot(children, $slots);
      }
      return $slots;
    };

    componentDidMount() {
      if (typeof config.didMount === 'function') {
        config.didMount.call(this.publicInstance);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (typeof config.didUpdate === 'function') {
        config.didUpdate.call(this.publicInstance, prevProps, prevState);
      }
    }

    componentWillUnmount() {
      if (typeof config.didUnmount === 'function') {
        config.didUnmount.call(this.publicInstance);
      }
    }

    render() {
      const { $slots, props, data } = this.publicInstance;
      return templateRender.call(this.publicInstance, { $slots, ...props, ...data });
    }
  };
}
