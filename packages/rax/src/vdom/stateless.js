import Host from './host';
import Component from '../component';

/**
 * Stateless Component Class Wrapper
 */
class StatelessComponent extends Component {
  constructor(pureRender) {
    super();
    // A stateless function
    this.pureRender = pureRender;
    this.hooksIndex = 0;
    this.state = {};
    this.willUnmountHandlers = [];
  }

  readContext(context) {
    const Provider = context.Provider;
    const unmaskContext = this._internal._context;
    const contextProp = Provider.contextProp;

    const contextEmitter = unmaskContext[contextProp];

    if (contextEmitter) {
      this.watchContext(contextEmitter);
      return contextEmitter.value;
    }

    return Provider.defaultValue;
  }

  watchContext(contextEmitter) {
    const mountId = this._internal._mountID;

    if (!contextEmitter[mountId]) {
      // One context one updater bind
      contextEmitter[mountId] = {};

      const contextUpdater = (newContext) => {
        if (newContext !== contextEmitter[mountId].renderedContext) {
          this.forceUpdate();
        }
      };

      contextEmitter.on(contextUpdater);

      this.willUnmountHandlers.push(() => {
        delete contextEmitter[mountId];
        contextEmitter.off(contextUpdater);
      });
    }

    contextEmitter[mountId].renderedContext = contextEmitter.value;
  }

  componentWillUnmount() {
    this.willUnmountHandlerst.forEach(handler => handler());
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }
    this.hooksIndex = 0;
    return this.pureRender(this.props, this.context);
  }
}

export default StatelessComponent;
