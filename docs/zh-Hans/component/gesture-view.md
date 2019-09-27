# GestureView  手势

## 安装

```bash
$ npm install rax-gesture-view --save
```

## 引用

```jsx
import GestureView from 'rax-gesture-view';
```


## API说明

### Slider

### 属性
|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onHorizontalPan|Function||监听水平滑动手势|
|onVerticalPan|Function||监听垂直滑动手势|



## 基本示例

```jsx
// demo

/** @jsx createElement */
import {createElement, Component, render} from 'rax';
import GestureView from 'rax-gesture-view';
import View from 'rax-view';
class App extends Component {

  onHorizontalPan = (e) => {
    console.error('onHorizontalPan:' + e.state);
  }

  onVerticalPan = (e) => {
    console.error('onVerticalPan:' + e.state);
  }

  render() {
    return (<View style={{flex: 1}}>
      <GestureView style={{width: 300, height: 300, backgroundColor: 'red'}}
        onVerticalPan={this.onVerticalPan}
        onHorizontalPan={this.onHorizontalPan}
      >pan me</GestureView>
    </View>);
  }
}

render(<App />);


```


## DEMO

[最简demo](https://jsplayground.taobao.org/raxplayground/bc7a290f-94c0-41a5-946f-9ff0c593df19)





