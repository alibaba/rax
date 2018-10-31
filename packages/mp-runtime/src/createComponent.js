import computeChangedData from './computeChangedData';

export default function createComponent(renderFactory, render, config) {
  const templateRender = renderFactory(render);

  return class extends render.Component {
    constructor(passedProps) {
      super({ ...config.props, ...passedProps});
      this.config = config;
      this.state = { ...config.data };
      this.publicInstance = this._createPublicInstance();
    }

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

    setData = (expData, callback) => {
      if (expData == null) return;
      this.setState(computeChangedData(this.data, expData), callback);
    }

    componentDidMount() {
      if (typeof this.config.didMount === 'function') {
        this.config.didMount.call(this.publicInstance);
      }
    }

    componentWillReceiveProps(prevProps, prevState) {
      if (typeof this.config.didUpdate === 'function') {
        this.config.didUpdate.call(this.publicInstance, prevProps, prevState);
      }
    }

    componentWillUnmount() {
      if (typeof this.config.didUnmount === 'function') {
        this.config.didUnmount.call(this.publicInstance);
      }
    }

    render() {
      return templateRender.call(this.publicInstance, this.publicInstance.data);
    }
  };
}
