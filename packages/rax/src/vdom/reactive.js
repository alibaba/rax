import Host from './host';
import Component from '../component';

const RE_RENDER_LIMIT = 24;
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
    this.isRenderScheduled = false;
    this.numberOfReRenders = 0;

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

  getHookId() {
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

  componentDidMount() {
    this.didMountHandlers.forEach(handler => handler());
  }

  componentDidUpdate() {
    this.didUpdateHandlers.forEach(handler => handler());
  }

  componentWillUnmount() {
    this.willUnmountHandlers.forEach(handler => handler());
  }

  update() {
    this.forceUpdate();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    this.hooksIndex = 0;
    this.numberOfReRenders = 0;
    this.isRenderScheduled = false;
    let children = this.pureRender(this.props, this.forwardRef ? this.forwardRef : this.context);

    while (this.isRenderScheduled) {
      this.numberOfReRenders++;
      if (this.numberOfReRenders > RE_RENDER_LIMIT) {
        throw new Error('Too many re-renders, the number of renders is limited to prevent an infinite loop.');
      }

      this.hooksIndex = 0;
      this.isRenderScheduled = false;
      children = this.pureRender(this.props, this.forwardRef ? this.forwardRef : this.context);
    }
    return children;
  }
}

export default ReactiveComponent;
