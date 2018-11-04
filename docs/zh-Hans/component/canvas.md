# Canvas

Weex 上依赖 [gcanvas](https://github.com/weex-plugins/weex-plugin-gcanvas)

Web 兼容参考浏览器支持度；Weex >= 0.10

## 安装

```bash
$ npm install rax-canvas --save
```

## 引用

```jsx
import Canvas from 'rax-canvas';
```

## 初始化

```
<Canvas style={{
  width: 750,
  height: 750
}} ref="raxCanvas" />;
```

## 代码演示

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Canvas from 'rax-canvas';

class CanvasSample extends Component {
  componentDidMount() {
    const contextPromise = this.refs.raxCanvasDemo.getContext();
    contextPromise.then((context) => {
      context.fillStyle = 'red';
      context.fillRect(0, 0, 100, 100);
    });
  }

  render() {
    return <Canvas style={{
      width: 750,
      height: 750
    }} ref="raxCanvasDemo" />;
  }
}

render(<CanvasSample />);
```

