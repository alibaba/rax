# Transition 渐变动画

与 Animated 相比具备更好的动画性能

## 安装

```bash
$ npm install universal-transition --save
```

## 引入

```jsx
import transition from 'universal-transition';
```

## 方法

### void transition(el, style, option, callback)

#### 参数

| 名称         | 类型       | 描述       | 可省略  | 默认值  |
| ---------- | -------- | -------- | ---- | ---- |
| `el`       | Array    | 节点。      | 否    | 无    |
| `style`    | Object   | 样式参数。    | 是    | 无    |
| `option`   | Object   | 动画参数。    | 否    | 无    |
| `callback` | Function | 动画成功的回调。 | 是    | 无    |

> 具体详情可查看 [weex 文档](https://weex-project.io/cn/references/modules/animation.html)


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
    backgroundColor: 'red'
  }
};

class App extends Component {
  componentDidMount() {
    const box = findDOMNode(this.refs.box); // 获取元素
    // 调用动画方法
    setTimeout(() => {
      transition(box, {
        transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)',
        opacity: '0.5'
      }, {
        timingFunction: 'ease',
        delay: 2000,
        duration: 3000
      }, () => {
        console.log('animation end');
      });
    }, 1000);
  }
  
  render() {
    return (
      <View ref="box" style={styles.container} />
    );
  }
}

render(<App />);
```

