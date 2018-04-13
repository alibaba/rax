import {Component, createElement, PropTypes, findDOMNode} from 'rax';
import View from 'rax-view';
import Touchable from 'rax-touchable';
import transition from 'universal-transition';
import {isWeex, isWeb} from 'universal-env';


export default class Modal extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    visible: PropTypes.bool,
    maskCanBeClick: PropTypes.bool,
    delay: PropTypes.number,
    duration: PropTypes.number
  };

  static defaultProps = {
    maskCanBeClick: true,
    visible: false,
    delay: 200,
    duration: 500
  };

  state = {
    visible: false,
    visibility: 'hidden'
  };

  height = 0;


  animated = (state, callback) => {
    const {visible} = state;
    const {delay, duration} = this.props;
    transition(findDOMNode(this.refs.mask), {
      opacity: visible === true ? 1 : 0
    }, {
      timingFunction: 'ease',
      delay,
      duration
    }, () => {
      callback && callback();
    });
  }

  show() {
    const currentState = {
      visible: true,
      visibility: 'visible'
    };
    this.setState;
    this.setState(
      currentState,
      () => this.animated(currentState, () => this.props.onShow && this.props.onShow(currentState))
    );
  }

  hide() {
    const currentState = {
      visible: false,
      visibility: 'hidden'
    };
    this.animated(
      currentState,
      () => this.setState(currentState, () => this.props.onHide && this.props.onHide(currentState))
    );
  }

  toggle(visible) {
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.visible != this.props.visible &&
      nextProps.visible != this.state.visible
    ) {
      this.toggle(nextProps.visible);
    }
  }

  componentWillMount() {
    this.setState({
      visible: this.props.visible
    });
    if (isWeb) {
      this.height = window.screen.height / window.screen.width * 750;
    }
  }

  componentDidMount() {
    if (isWeex) {
      let dom = require('@weex-module/dom');
      dom.getComponentRect('viewport', (e) => {
        this.height = e.size.height;
        this.animated(this.state);
      });
    } else if (isWeb) {
      this.animated(this.state);
    }
  }

  render() {
    const {contentStyle, children, maskCanBeClick} = this.props;
    const {visible} = this.state;
    // HACK: register a empty click event to fix Android click penetration problem when in mask
    return (
      <View
        ref={'mask'}
        onClick={() => {
          maskCanBeClick && this.hide();
        }}
        style={{
          ...styles.mask,
          height: this.height,
          visibility: this.state.visibility,
        }}
      >
        <Touchable
          onPress={(e) => {
            if (isWeb) {
              e.stopPropagation && e.stopPropagation();
            }
          }}
          style={[styles.main, contentStyle]}
        >
          {children}
        </Touchable>
      </View>
    );
  }
}

const styles = {
  mask: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 750,
    height: 3000,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  main: {
    width: 640,
    height: 340,
    backgroundColor: '#ffffff'
  }
};
