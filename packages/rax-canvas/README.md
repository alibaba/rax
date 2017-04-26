# rax-canvas

[![npm](https://img.shields.io/npm/v/rax-canvas.svg)](https://www.npmjs.com/package/rax-canvas)

Rax canvas api.

## Install

```bash
$ npm install rax-canvas --save
```

## Import

```jsx
import Canvas from 'rax-canvas';
```

## Init

use canvas：

```jsx
<Canvas style={{
  width: 750,
  height: 750
}} ref="raxCanvas" />;
```

## Props

| name      | type       | default  | describe   |
| :------ | :------- | :--- | :--- |
| style | Object |    | {width: 750, height: 400} |

## Example

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


