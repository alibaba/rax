# 事件处理

在无线页面中，用户交互主要就是通过点击事件来实现的。它可以是点击了一个按钮，滚动一个列表，或者做了复杂的手势动作。  

这里我们就来列举下各种不同的手势事件在 Rax 中的实现。

## 简单的点击事件

对于简单的 Touch 事件，我们可以使用 Touchable, 通过给它绑定 onPress 事件，来监听他的点击事件 ：

```jsx
import {createElement, Component} from 'rax';
import ScrollView from 'rax-scrollview';
import Touchable from 'rax-touchable';
import Text from 'rax-text';
 
class TouchDemo extends Component {
  render() {
    return (
      <ScrollView>
        <Touchable onPress={() => console.log('pressed')}>
          <Text>Proper Touch Handling</Text>
        </Touchable>
      </ScrollView>
    );
  }
}
```

## Appear事件

Appear 可以让我们在元素出现的时候做一些事情，比如曝光埋点。rax-picture的图片懒加载也依赖 appear 事件的触发。

在元素上绑定 onAppear 事件：

```jsx
import {createElement, Component} from 'rax';
import View from 'rax-view';
import Touchable from 'rax-touchable';
import Text from 'rax-text';
 
class TouchDemo extends Component {
  render() {
    return (
      <View onAppear={(ev) => {
        console.log('appear');
      }} onDisappear={(ev) => {
        console.log('disappear');
      }}>
        <Text>Hello world</Text>
      </View>
    );
  }
}
```

## 滚动事件

ScrollView 为我们包装了滚动事件。它同时支持横向滚动和竖向滚动。

通过下面这三个属性可以更好地实现我们熟悉的 onScroll 相关的功能：

- throttle: 这个属性控制在滚动过程中，scroll事件被调用的频率（默认值为100），用于滚动的节流
- loadMoreOffset: 设置加载更多的偏移 可以写作loadmoreoffset（默认值为100）
- onLoadMore: 滚动区域还剩 loadmoreoffset 的长度时触发

示例：

```jsx
import {createElement, Component} from 'rax';
import ScrollView from 'rax-scrollview';
import Touchable from 'rax-touchable';
import Text from 'rax-text';
 
class TouchDemo extends Component {
  render() {
    return (
      <ScrollView loadMoreOffset={300} onLoadMore={()=>{}}>
        <Text style={{
          color:'# ffffff',
          margin:'5rem',
          fontSize:'100rem',
          backgroundColor:"blue"
        }}>
            Shake or press menu button for dev menuShake or press menu button for dev menu
            Shake or press menu button for dev menuShake or press menu button for dev menu
            Shake or press menu button for dev menuShake or press menu button for dev menu
            Shake or press menu button for dev menuShake or press menu button for dev menu
        </Text>
      </ScrollView>
    );
  }
}
```

如果我们需要更加完整的列表展现，可以使用 Listview 。它具有更多的也加贴近业务需求的丰富功能。  

## 用户输入事件

TextInput 是唤起用户输入的基础组件。当定义 multiline 输入多行文字时其功能相当于 textarea。

```jsx
import {createElement, Component} from 'rax';
import TextInput from 'rax-textinput';
import Touchable from 'rax-touchable';
import Text from 'rax-text';
 
class TouchDemo extends Component {
  render() {
    return (
      <TextInput
        placeholder="Enter text to see events"
        autoFocus multiline
        onFocus={() => console.log('onFocus')}
        onBlur={() => console.log('onBlur')}
        onInput={() => console.log('onInput')}
        style={{
            width: '1000rem',
            height: '1000rem',
            border: '1px solid # 000'
        }}
    />
    );
  }
}
```

## 复杂手势事件

对于复杂的手势事件，我们可以使用 `panresponder`。  

与 React Native 中的 PanResponder 相同，响应手势的基本单位是 responder ， 任何一个 View 组件可以被当做一个 responder ，对已一个在屏幕上移动的 move 手势来说， 它的流程大概是这样的：`respond move -> grant -> move -> release`

```jsx
this._panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,
  onPanResponderGrant: () => { // do something },
  onPanResponderMove: () => { // do something },
  onPanResponderRelease: () => { // do something },
});
```

详情可以参考：[手势处理](/guide/panresponder)
