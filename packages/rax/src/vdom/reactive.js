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
    this.$_render = pureRender;
    this._hookID = 0;
    // Number of rerenders
    this.$_reRenders = 0;
    this._hooks = {};
    // Handles store
    this.didMount = [];
    this.didUpdate = [];
    this.willUnmount = [];
    // Is render scheduled
    this.$_isScheduled = false;
    this.shouldUpdate = false;
    this.$_children = null;
    this.$_dependencies = {};

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
    let contextItem = this.$_dependencies[contextProp];
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
      this.$_dependencies[contextProp] = contextItem;
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
    this[INTERNAL].$_isPendingForceUpdate = true;
    this.setState({});
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    this._hookID = 0;
    this.$_reRenders = 0;
    this.$_isScheduled = false;
    let children = this.$_render(this.props, this.forwardRef ? this.forwardRef : this.context);

    while (this.$_isScheduled) {
      this.$_reRenders++;
      if (this.$_reRenders > RE_RENDER_LIMIT) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('Too many re-renders, the number of renders is limited to prevent an infinite loop.');
        } else {
          invokeMinifiedError(4);
        }
      }

      this._hookID = 0;
      this.$_isScheduled = false;
      children = this.$_render(this.props, this.forwardRef ? this.forwardRef : this.context);
    }

    if (this.shouldUpdate) {
      this.$_children = children;
      this.shouldUpdate = false;
    }

    return this.$_children;
  }
}
