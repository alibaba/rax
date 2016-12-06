import {createElement, Component, render, setNativeProps} from 'rax';
import {View} from 'rax-components';
import PanResponder from 'universal-panresponder';
import Animated from 'rax-animated';

class Drag extends Component {
  state = {
    pan: new Animated.ValueXY(),
    scale: new Animated.Value(1),
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  render() {
    // Destructure the value of pan from the state
    let { pan, scale } = this.state;

    // Calculate the x and y transform from the pan value
    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = '0deg';

    // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
    let imageStyle = {transform: [{translateX}, {translateY}, {rotate}, {scale}]};

    return (
      <View style={styles.container}>
        <Animated.Image
          source={{height: 200, width: 200, uri: 'https://gw.alicdn.com/L1/461/1/40137b64ab73a123e78d8246cd81c8379358c999_400x400.jpg'}}
          style={imageStyle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  _handleStartShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }

  _handlePanResponderGrant = (e, gestureState) => {
    this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
    this.state.pan.setValue({x: 0, y: 0});
    Animated.spring(
      this.state.scale,
      { toValue: 1.1, friction: 3 }
    ).start();
  };

  _handlePanResponderMove = Animated.event([
    null, {dx: this.state.pan.x, dy: this.state.pan.y},
  ]);

  _handlePanResponderEnd = (e, gestureState) => {
    this.state.pan.flattenOffset();
    Animated.spring(
      this.state.scale,
      { toValue: 1, friction: 3 }
    ).start();
  };
}

var styles = {
  container: {
    flex: 1,
    paddingTop: 64,
  },
};

render(<Drag />);
