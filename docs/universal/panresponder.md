Rx PanResponder
====================

Rx PanResponder 用来实现复杂的手势操作。 

方法：

+ static create(config: object)  object 是这样的函数：
    - onMoveShouldSetPanResponder: (e, gestureState) => {...}
    - onMoveShouldSetPanResponderCapture: (e, gestureState) => {...}
    - onStartShouldSetPanResponder: (e, gestureState) => {...}
    - onStartShouldSetPanResponderCapture: (e, gestureState) => {...}
    - onPanResponderReject: (e, gestureState) => {...}
    - onPanResponderGrant: (e, gestureState) => {...}
    - onPanResponderStart: (e, gestureState) => {...}
    - onPanResponderEnd: (e, gestureState) => {...}
    - onPanResponderRelease: (e, gestureState) => {...}
    - onPanResponderMove: (e, gestureState) => {...}
    - onPanResponderTerminate: (e, gestureState) => {...}
    - onPanResponderTerminationRequest: (e, gestureState) => {...}
    - onShouldBlockNativeResponder: (e, gestureState) => {...}

通常来说，对那些有对应捕获事件的事件来说，在捕获阶段更新gestureState一次，然后在冒泡阶段直接使用即可。  

注意onStartShould 回调。他们只会在此节点冒泡/捕获的开始/结束事件中提供已经更新过的gestureState。  

一旦这个节点成为了事件的响应者，则所有的开始/结束事件都会被手势正确处理，并且gestureState也会被正确更新。

使用示例：

```js
/* @jsx createElement */

import {createElement, Component, render, findDOMNode} from '@ali/rx';
import {mount} from '@ali/rx-mounter';
import {View} from '@ali/rx-components';
import PanResponder from '@ali/rx-panresponder';

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
      <View
        style={styles.container}>
        <View
          ref={(circle) => {
            this.circle = circle;
          }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  _highlight () {
    if (this.circle && this.circle.setNativeProps) {
      this.circle.setNativeProps({
        style: {
          backgroundColor: CIRCLE_HIGHLIGHT_COLOR
        }
      });
    }
  }

  _unHighlight () {

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

var styles = {
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

mount(<PanResponderSample />, 'body');
```

对于每一个手势处理函数，它提供了一个 gestureState 对象。

一个 gestureState 对象有如下的字段：

- stateID - 触摸状态的ID。在屏幕上有至少一个触摸点的情况下，这个ID会一直有效。
- moveX - 最近一次移动时的屏幕横坐标
- moveY - 最近一次移动时的屏幕纵坐标
- x0 - 当响应器产生时的屏幕坐标
- y0 - 当响应器产生时的屏幕坐标
- dx - 从触摸操作开始时的累计横向路程
- dy - 从触摸操作开始时的累计纵向路程
- vx - 当前的横向移动速度
- vy - 当前的纵向移动速度
- numberActiveTouches - 当前在屏幕上的有效触摸点的数量