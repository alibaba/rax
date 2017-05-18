import {Component, createElement, PropTypes} from 'rax';
import View from 'rax-view';
import Animated from 'rax-animated';

const {View: AnimatedView} = Animated;

const fadeAnim = new Animated.Value(0);

export default class Modal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    visible: PropTypes.bool
  };

  static defaultProps = {
    visible: false
  };

  state = {
    visible: false
  };

  animated(state, callback) {
    const {visible} = state;
    Animated.timing(
      fadeAnim,
      { toValue: visible === true ? 1 : 0}
    ).start(callback);
  }

  show() {
    const currentState = {visible: true};
    this.setState(
      currentState,
      () => this.animated(currentState, () => this.props.onShow && this.props.onShow(currentState))
    );
  }

  hide() {
    const currentState = {visible: false};
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
  }

  componentDidMount() {
    this.animated(this.state);
  }

  render() {
    const {contentStyle, children} = this.props;
    const {visible} = this.state;
    // HACK: 'onClick={() => {}}' fix for Android click penetration events (in mask AnimatedView)
    return (
      visible && <AnimatedView
        onClick={() => {}}
        style={[styles.mask, {opacity: fadeAnim}]}
      >
        <View style={[styles.main, contentStyle]}>
          {children}
        </View>
      </AnimatedView>
    );
  }
}

const styles = {
  mask: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    width: 640,
    height: 340,
    backgroundColor: '#ffffff'
  }
};
