# universal-panresponder [![npm](https://img.shields.io/npm/v/universal-panresponder.svg)](https://www.npmjs.com/package/universal-panresponder)

> A solution to the touch gesture. Reference to the [React Native PanResponder](https://facebook.github.io/react-native/docs/panresponder.html)

## Install

```bash
$ npm install universal-panresponder --save
```

## Usage

```jsx
import {createElement, Component, render, findDOMNode} from 'rax';
import {View} from 'rax-components';
import PanResponder from 'universal-panresponder';

const CIRCLE_SIZE = 80;
const CIRCLE_COLOR = 'blue';
const CIRCLE_HIGHLIGHT_COLOR = 'green';

class PanResponderSample extends Component {

  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 20;
    this._previousTop = 84;
    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop
      }
    };
  }

  componentDidMount () {
    this._updatePosition();
  }

  render () {
    return (
      <View style={styles.container}>
        <View
          ref={(circle) => { this.circle = circle; }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  _highlight() {
    if (this.circle && this.circle.setNativeProps) {
      this.circle.setNativeProps({
        style: {
          backgroundColor: CIRCLE_HIGHLIGHT_COLOR
        }
      });
    }
  }

  _unHighlight() {
    if (this.circle && this.circle.setNativeProps) {
      this.circle.setNativeProps({
        style: {
          backgroundColor: CIRCLE_COLOR
        }
      });
    }
  }

  _updatePosition () {
    if (this.circle && this.circle.setNativeProps) {
      this.circle.setNativeProps(this._circleStyles);
    }
  }

  _handleStartShouldSetPanResponder (e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder (e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }

  _handlePanResponderGrant = (e, gestureState) => this._highlight();


  _handlePanResponderMove = (e, gestureState) => {
    this._circleStyles.style.left = this._previousLeft + gestureState.dx;
    this._circleStyles.style.top = this._previousTop + gestureState.dy;
    this._updatePosition();
  };

  _handlePanResponderEnd = (e, gestureState) => {
    this._unHighlight();
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
  };
}

const styles = {
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_COLOR,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
};

render(<PanResponderSample />, mountNode);
```

For more complete documentation, please refer to [React Native PanResponder](https://facebook.github.io/react-native/docs/panresponder.html).