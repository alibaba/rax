import {createElement, Component, render} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Image from 'rax-image';
import Animated from 'rax-animated';

class AnimatedSample extends Component {

  state = {
    bounceValue: new Animated.Value(0),
    translateValue: new Animated.ValueXY({x:0, y:0}),
    rotateValue: new Animated.Value(0),
  };

  render() {
    return (
      <Animated.Image
        source={{uri: 'http://img1.tbcdn.cn/L1/461/1/40137b64ab73a123e78d8246cd81c8379358c999'}}
        style={{
          width: 112,
          height: 96,
          marginTop: 50,
          transform: [
            {
              scale: this.state.bounceValue,
            },
            {
              translateX: this.state.translateValue.x
            },
            {
              translateY: this.state.translateValue.y
            }
          ]
        }}
      />
    );
  }

  componentDidMount() {
    this.state.bounceValue.setValue(1.5);
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 0.8,
        friction: 1,
      }
    ).start();

    this.state.rotateValue.setValue(125);

    Animated.spring(
      this.state.rotateValue,
      {
        toValue: 0,
        friction: 1,
      }
    ).start();

  }
}

render(<AnimatedSample />);
