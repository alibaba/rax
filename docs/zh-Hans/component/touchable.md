# Touchable 可点击容器

Touchable 定义简单的 touch 事件。
使用 Touchable 我们不用担心复杂的视图结构，也就是说我们不必再担心类似以前 tap 点击穿透这样的问题了。
对于复杂的手势事件，我们可以使用 [rax-panresponder](/guide/panresponder) 。

![](https://gw.alicdn.com/tfs/TB1RdcyRVXXXXalXXXXXXXXXXXX-255-334.gif)

## 安装

```bash
$ npm install rax-touchable --save
```

## 引用

```jsx
import Touchable from 'rax-touchable';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | 点击事件 |

同时支持任意自定义属性的透传

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Touchable from 'rax-touchable';

render(<Touchable onPress={() => { alert('hello'); }}>Click Me</Touchable>);
```

```jsx
//demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';

class App extends Component {
  state = {
    eventLog: [],
  };

  _appendEvent = (eventName) => {
    var limit = 6;
    var eventLog = this.state.eventLog.slice(0, limit - 1);
    eventLog.unshift(eventName);
    this.setState({eventLog});
  };

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <TouchableHighlight
            onPress={() => this._appendEvent('press')}
            delayPressIn={400}
            onPressIn={() => this._appendEvent('pressIn - 400ms delay')}
            delayPressOut={1000}
            onPressOut={() => this._appendEvent('pressOut - 1000ms delay')}
            delayLongPress={800}
            onLongPress={() => this._appendEvent('longPress - 800ms delay')}
            style={{
              width: '230rem',
              height: '60rem',
              paddingTop: '12rem',
              paddingBottom: '12rem',
              paddingLeft: '25rem',
              paddingRight: '25rem',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#efefef',
            }}>
            <Text>Touch Me</Text>
          </TouchableHighlight>

          <View style={styles.eventLogBox}>
            {this.state.eventLog.map((e, ii) => <Text key={ii}>{e}</Text>)}
          </View>
        </View>
      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  eventLogBox: {
    padding: 10,
    margin: 10,
    height: 260,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};


render(<App/>);
```