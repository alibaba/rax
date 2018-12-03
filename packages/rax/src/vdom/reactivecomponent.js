import Host from './host';
import Component from '../component';

/**
 * Reactive Function Component Class Wrapper
 */
class ReactiveComponent extends Component {
  constructor(pureRender) {
    super();
    // A stateless function
    this.pureRender = pureRender;
    this.hooksIndex = 0;
    this.hooks = {};
    this.didMountHandlers = [];
    this.didUpdateHandlers = [];
    this.willUnmountHandlers = [];
  }

  getCurrentHookId() {
    return ++this.hooksIndex;
  }

  readContext(context) {
    const Provider = context.Provider;
    const unmaskContext = this._internal._context;
    const contextProp = Provider.contextProp;

    const contextEmitter = unmaskContext[contextProp];

    if (contextEmitter) {
      const mountId = this._internal._mountID;

      if (!contextEmitter[mountId]) {
        // One context one updater bind
        contextEmitter[mountId] = {};

        const contextUpdater = (newContext) => {
          if (newContext !== contextEmitter[mountId].renderedContext) {
            this.update();
          }
        };

        contextEmitter.on(contextUpdater);

        this.willUnmountHandlers.push(() => {
          delete contextEmitter[mountId];
          contextEmitter.off(contextUpdater);
        });
      }

      return contextEmitter[mountId].renderedContext = contextEmitter.value;
    }

    return Provider.defaultValue;
  }

  isComponentRendered() {
    return Boolean(this._internal._renderedComponent);
  }

  componentDidMount() {
    this.didMountHandlers.forEach(handler => handler());
  }

  componentDidUpdate() {
    this.didUpdateHandlers.forEach(handler => handler());
  }

  componentWillUnmount() {
    this.willUnmountHandlers.forEach(handler => handler());
  }

  // Async update
  update() {
    const setImmediate = typeof setImmediate === 'function' ? setImmediate : setTimeout;
    setTimeout(() => this.forceUpdate());
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }
    this.hooksIndex = 0;
    return this.pureRender(this.props, this.context);
  }
}

export default ReactiveComponent;
