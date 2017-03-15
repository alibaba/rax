# Transition 渐变动画

## 安装

```bash
$ npm install universal-transition --save
```

## 引入

```jsx
import transition from 'universal-transition';
```

## API

transition(Node domNode, Object from, Object to, function onEnd);

- domNode：节点，施展动画的 DOM 节点
- from：对象，描述动画开始时的状态
- to：对象，描述动画结束时的状态
- onEnd：函数，当动画结束时执行的回调

## 基本使用

```jsx
// demo
import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import transition from 'universal-transition';

const styles = {
  container: {
    width: 100,
    height: 100,
    background: 'red'
  }
};

class App extends Component {
  componentDidMount() {
    const box = findDOMNode(this.refs.box); // 获取元素
    // 调用动画方法
    transition(box, {
      transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)',
      opacity: '0.5'
    }, {
      timingFunction: 'ease',
      delay: 0,
      duration: 1000
    }, () => {
      console.log('animation end');
    });
  }
  
  render() {
    return (
      <View ref="box" style={styles.container}></View>
    );
  }
}

render(<App />);
```

