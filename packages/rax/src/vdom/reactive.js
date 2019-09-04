import Host from './host';
import Component from './component';
import runCallbacks from '../runCallbacks';
import { invokeMinifiedError } from '../error';
import { INTERNAL } from '../constant';

const RE_RENDER_LIMIT = 24;
/**
 * Functional Reactive Component Class Wrapper
 */
export default class ReactiveComponent extends Component {
  constructor(pureRender, ref) {
    super();
    // A pure function
    this.$$render = pureRender;
    this._hookID = 0;
    // Number of rerenders
    this.$$reRenders = 0;
    this._hooks = {};
    // Handles store
    this.didMount = [];
    this.didUpdate = [];
    this.willUnmount = [];
    // Is render scheduled
    this.$$isScheduled = false;
    this.shouldUpdate = false;
    this.$$children = null;
    this.$$dependencies = {};

    this.state = {};

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
          }
        }

        return !arePropsEqual || this.prevForwardRef !== this.forwardRef;
      };
    }
  }

  getHooks() {
    return this._hooks;
  }

  getHookID() {
    return ++this._hookID;
  }

  readContext(context) {
    const Provider = context.Provider;
    const contextProp = Provider.contextProp;
    let contextItem = this.$$dependencies[contextProp];
    if (!contextItem) {
      const readEmitter = Provider.readEmitter;
      const contextEmitter = readEmitter(this);
      contextItem = {
        emitter: contextEmitter,
        renderedContext: contextEmitter.value,
      };

      const contextUpdater = (newContext) => {
        if (newContext !== contextItem.renderedContext) {
          this.shouldUpdate = true;
          this.update();
        }
      };

      contextItem.emitter.on(contextUpdater);
      this.willUnmount.push(() => {
        contextItem.emitter.off(contextUpdater);
      });
      this.$$dependencies[contextProp] = contextItem;
    }
    return contextItem.renderedContext = contextItem.emitter.value;
  }

  componentWillMount() {
    this.shouldUpdate = true;
  }

  componentDidMount() {
    runCallbacks(this.didMount);
  }

  componentWillReceiveProps() {
    this.shouldUpdate = true;
  }

  componentDidUpdate() {
    runCallbacks(this.didUpdate);
  }

  componentWillUnmount() {
    runCallbacks(this.willUnmount);
  }

  update() {
    this[INTERNAL].$$isPendingForceUpdate = true;
    this.setState({});
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    this._hookID = 0;
    this.$$reRenders = 0;
    this.$$isScheduled = false;
    let children = this.$$render(this.props, this.forwardRef ? this.forwardRef : this.context);

    while (this.$$isScheduled) {
      this.$$reRenders++;
      if (this.$$reRenders > RE_RENDER_LIMIT) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('Too many re-renders, the number of renders is limited to prevent an infinite loop.');
        } else {
          invokeMinifiedError(4);
        }
      }

      this._hookID = 0;
      this.$$isScheduled = false;
      children = this.$$render(this.props, this.forwardRef ? this.forwardRef : this.context);
    }

    if (this.shouldUpdate) {
      this.$$children = children;
      this.shouldUpdate = false;
    }

    return this.$$children;
  }
}
