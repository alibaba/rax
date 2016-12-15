import { Component, PropTypes } from 'rax';
import storeShape from '../utils/storeShape';
import warning from '../utils/warning';

const NODE_ENV = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

let didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  warning(
    '<Provider> does not support changing `store` on the fly. '
  );
}

export default class Provider extends Component {
  getChildContext() {
    return { store: this.store };
  }

  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }

  render() {
    return this.props.children;
  }
}

if (NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function(nextProps) {
    const { store } = this;
    const { store: nextStore } = nextProps;

    if (store !== nextStore) {
      warnAboutReceivingStore();
    }
  };
}

Provider.propTypes = {
  store: storeShape.isRequired,
  children: PropTypes.element.isRequired
};

Provider.childContextTypes = {
  store: storeShape.isRequired
};

Provider.displayName = 'Provider';