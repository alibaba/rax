# Toast 弹出框

弹出框，反馈的内容与当前操作有直接关联，提示为非阻碍式，它不打断用户当前操作。

## 安装

```bash
$ npm install universal-toast --save
```

## 引用

```jsx
import Toast from 'universal-toast';
```

## API

```jsx
show(message, duration = Toast.SHORT_DELAY);
```

- message: String, toast 中展示的信息;  
- duration: 自定义持续的时间，SHORT 2s， LONG 3.5s;

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Toast from 'universal-toast';
import View from 'rax-view';
import Touchable from 'rax-touchable';

const styles = {
  text: {
    fontSize: 50
  }
};

class App extends Component {
  
  render() {
    return (
      <View>
        <Touchable style={styles.text}
          onPress={() => {Toast.show('Hi')}}>Hi</Touchable>
        <Touchable style={styles.text}
          onPress={() => {Toast.show('Hello Short', Toast.SHORT)}}>Hello Short</Touchable>
        <Touchable style={styles.text}
          onPress={() => {Toast.show('Hello Long', Toast.LONG)}}>Hello Long</Touchable>
      </View>
    )
  }
}

render(<App />);
```
