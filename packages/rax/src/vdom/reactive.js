import Host from './host';
import Component from './component';
import invokeFunctionsWithContext from '../invokeFunctionsWithContext';
import { throwMinifiedError } from '../error';
import { INTERNAL } from '../constant';
import { EMPTY_OBJECT } from '../types';

const RE_RENDER_LIMIT = 24;
/**
 * Functional Reactive Component Class Wrapper
 */
export default class ReactiveComponent extends Component {
  constructor(pureRender, ref) {
    super();
    // Marked ReactiveComponent.
    this.__isReactiveComponent = true;
    // A pure function
    this.__render = pureRender;
    this.__hookID = 0;
    // Number of rerenders
    this.__reRenders = 0;
    this.__hooks = {};
    // Is render scheduled
    this.__isScheduled = false;
    this.__shouldUpdate = false;
    this.__children = null;
    this.__contexts = {};
    // Handles store
    this.didMount = [];
    this.didUpdate = [];
    this.willUnmount = [];

    this.state = EMPTY_OBJECT;

    if (pureRender._forwardRef) {
      this.__prevForwardRef = this._forwardRef = ref;
    }

    const compares = pureRender.__compares;
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

        return !arePropsEqual || this.__prevForwardRef !== this._forwardRef;
      };
    }
  }

  getHooks() {
    return this.__hooks;
  }

  getHookID() {
    return ++this.__hookID;
  }

  useContext(context) {
    const contextID = context._contextID;
    let contextItem = this.__contexts[contextID];
    if (!contextItem) {
      const provider = context.__getNearestParentProvider(this);
      contextItem = this.__contexts[contextID] = {
        __provider: provider
      };

      if (provider) {
        const handleContextChange = (value) => {
          // Check the last value that maybe alread rerender
          // avoid rerender twice when provider value changed
          if (contextItem.__lastValue !== value) {
            this.__shouldUpdate = true;
            this.__update();
          }
        };
        provider.__on(handleContextChange);
        this.willUnmount.push(() => provider.__off(handleContextChange));
      }
    }

    return contextItem.__lastValue = contextItem.__provider ?
      contextItem.__provider.getValue() : context._defaultValue;
  }

  componentWillMount() {
    this.__shouldUpdate = true;
  }

  componentDidMount() {
    invokeFunctionsWithContext(this.didMount);
  }

  componentWillReceiveProps() {
    this.__shouldUpdate = true;
  }

  componentDidUpdate() {
    invokeFunctionsWithContext(this.didUpdate);
  }

  componentWillUnmount() {
    invokeFunctionsWithContext(this.willUnmount);
  }

  __update() {
    this.setState(EMPTY_OBJECT);
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    this.__hookID = 0;
    this.__reRenders = 0;
    this.__isScheduled = false;
    let children = this.__render(this.props, this._forwardRef ? this._forwardRef : this.context);

    while (this.__isScheduled) {
      this.__reRenders++;
      if (this.__reRenders > RE_RENDER_LIMIT) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('Too many re-renders, the number of renders is limited to prevent an infinite loop.');
        } else {
          throwMinifiedError(4);
        }
      }

      this.__hookID = 0;
      this.__isScheduled = false;
      children = this.__render(this.props, this._forwardRef ? this._forwardRef : this.context);
    }

    if (this.__shouldUpdate) {
      this.__children = children;
      this.__shouldUpdate = false;
    }

    return this.__children;
  }
}
