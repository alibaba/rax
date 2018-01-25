# 手势处理

在 Rax 中 我们可以使用 `universal-panresponder` 来实现复杂的手势操作。

## 引用方式

```jsx
import PanResponder from 'universal-panresponder';

this._panResponder = PanResponder.create({
  onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
  onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
  onPanResponderGrant: this._handlePanResponderGrant,
  onPanResponderMove: this._handlePanResponderMove,
  onPanResponderRelease: this._handlePanResponderEnd,
  onPanResponderTerminate: this._handlePanResponderEnd,
});
```

## 属性

无


## 方法

### static create(config)

#### 参数

| 名称                                       | 类型       | 描述                                       | 可省略  | 默认值  |
| ---------------------------------------- | -------- | ---------------------------------------- | ---- | ---- |
| config                                   | Object   | 触发的手势操作配置                                | 否    | 无    |
| config.onMoveShouldSetPanResponder       | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onMoveShouldSetPanResponderCapture | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onStartShouldSetPanResponder      | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onStartShouldSetPanResponderCapture | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderReject              | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderGrant               | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderStart               | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderEnd                 | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderRelease             | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderMove                | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderTerminate           | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onPanResponderTerminationRequest  | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |
| config.onShouldBlockNativeResponder      | function | 函数中含有 event （事件对象）,  gestureState （手势状态） 两个参数 | 是    | 无    |

##### 事件对象 event 中包含的属性

| 名称                   | 类型     | 描述                |
| -------------------- | ------ | ----------------- |
| event.changedTouches | Array  | 手势变化的数组对象         |
| event.identifier     | Number | 手势的 ID            |
| event.locationX      | Number | 手势的 X 坐标跟元素相关     |
| event.locationY      | Number | 手势的 Y 坐标跟元素相关     |
| event.pageX          | Number | 手势的 X 坐标跟根节点相关    |
| event.pageY          | Number | 手势的 Y 坐标跟根节点相关    |
| event.target         | Node   | 接受 touch 事件的元素    |
| event.timestamp      | Number | 手势的时间戳            |
| event.touches        | Array  | 目前屏幕上的所有 touch 事件 |

##### 手势状态 gestureState 中包含的属性

| 名称                               | 类型     | 描述              |
| -------------------------------- | ------ | --------------- |
| gestureState.stateID             | Array  | 手势状态的 ID        |
| gestureState.moveX               | Number | 最近移动触摸屏的最新屏幕坐标  |
| gestureState.moveY               | Number | 最近移动触摸屏的最新屏幕坐标  |
| gestureState.x0                  | Number | 手势响应的屏幕坐标       |
| gestureState.y0                  | Number | 手势响应的屏幕坐标       |
| gestureState.dx                  | Number | 手势距离            |
| gestureState.dy                  | Node   | 手势距离            |
| gestureState.vx                  | Number | 手势速度            |
| gestureState.vy                  | Array  | 手势速度            |
| gestureState.numberActiveTouches | Array  | 目前屏幕上的 touch 事件 |

#### 示例

```javascript
import {createElement, Component, render, findDOMNode, setNativeProps} from 'rax';
import View from 'rax-view';
import PanResponder from 'universal-panresponder';

const CIRCLE_SIZE = 80;
const CIRCLE_COLOR = 'blue';
const CIRCLE_HIGHLIGHT_COLOR = 'green';

const styles = {
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_COLOR,
    position: 'absolute',
    left: 50,
    top: 0,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
};

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
          ref='circle'
          style={styles.circle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  _highlight () {
    if (this.refs.circle) {
      setNativeProps(this.refs.circle, {
        style: {
          backgroundColor: CIRCLE_HIGHLIGHT_COLOR
        }
      });
    }
  }

  _unHighlight () {
    if (this.refs.circle) {
      setNativeProps(this.refs.circle, {
        style: {
          backgroundColor: CIRCLE_COLOR
        }
      });
    }
  }

  _updatePosition () {
    if (this.refs.circle) {
      setNativeProps(this.refs.circle, this._circleStyles);
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

render(<PanResponderSample />);
```

