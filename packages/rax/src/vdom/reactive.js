import Host from './host';
import Component from '../component';
import { scheduleImmediateCallback } from './scheduler';

/**
 * Functional Reactive Component Class Wrapper
 */
class ReactiveComponent extends Component {
  constructor(pureRender, ref) {
    super();
    // A pure function
    this.pureRender = pureRender;
    this.hooksIndex = 0;
    this.hooks = {};
    this.didMountHandlers = [];
    this.didUpdateHandlers = [];
    this.willUnmountHandlers = [];

    if (pureRender.forwardRef) {
      this.prevForwardRef = this.forwardRef = ref;
    }

    const compares = pureRender.compares;
    if (compares) {
      this.shouldComponentUpdate = (nextProps) => {
        // Process composed compare
        let arePropsEqual = true;

        // Compare push in and pop out
        for (let i = compares.length - 1; i > -1; i--) {
          if (arePropsEqual = compares[i](this.props, nextProps)) {
            break;
          };
        }

        return !arePropsEqual || this.prevForwardRef !== this.forwardRef;
      };
    }
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
    scheduleImmediateCallback(() => this.forceUpdate());
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }
    this.hooksIndex = 0;
    return this.pureRender(this.props, this.forwardRef ? this.forwardRef : this.context);
  }
}

export default ReactiveComponent;
