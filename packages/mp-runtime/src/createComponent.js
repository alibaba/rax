import computeChangedData from './computeChangedData';

export default function createComponent(renderFactory, render, config) {
  const templateRender = renderFactory(render);

  return class extends render.Component {
    constructor() {
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

      Object.defineProperty(scope, 'data', {
        get: () => this.state,
      });

      Object.defineProperty(scope, 'setData', {
        get: () => this.setData,
      });

      Object.defineProperty(scope, '$slots', {
        get: () => ({ default: this.props.children }),
      });

      return scope;
    }

    setData = (data, callback) => {
      if (data == null) return;
      this.setState(computeChangedData(this.data, data), callback);
    }

    componentDidMount() {
      if (typeof config.didMount === 'function') {
        this.config.didMount.call(this.publicInstance);
      }
    }

    componentWillReceiveProps(prevProps, prevState) {
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
      return templateRender.call(this.publicInstance, this.publicInstance.data);
    }
  };
}
