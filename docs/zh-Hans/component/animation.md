# Animation  基于bindingx的多元素帧动画工具

## 安装

```bash
$ npm install universal-animation --save
```

## 引用

```jsx
import animate from 'universal-animation';
```


## API说明


#### 方法

|名称|参数|返回值|描述|
|:---------------|:--------|:----|:----------|
| animate |(config,callback)|Animation|创建动画|

#### config详解

##### props 多个元素动画配置

- element 元素
- property 动画属性(和bindingx一致)
- start 开始值
- end 结束值
- duration 周期(单位ms)
- easing 缓动函数(详见[支持缓动函数](https://alibaba.github.io/bindingx/guide/cn_api_interpolator))
- delay 延迟时间(单位ms,默认0)
## 基本示例

```jsx
// demo
import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import {isWeex} from 'universal-env';
import animate from 'universal-animation';

class Demo extends Component {

  run = () => {

    let easing = `cubicBezier(.25,.1,.25,1)`;
    let delay = 0;
    let duration = 1000;
    let property = 'transform.translateX';
    let start = 0;
    let end = 200;

    animate({
      forceTransition:true,
      props: [{
        element: findDOMNode(this.refs.block),
        property,
        easing,
        duration,
        start,
        end,
        delay
      }]
    }, () => {
      console.log('transition end')
    })

    animate({
      props: [{
        element: findDOMNode(this.refs.block2),
        property,
        easing,
        duration,
        start,
        end,
        delay
      }]
    }, () => {
      console.log('timing end')
    })
  }


  render() {
    return <View style={{flex:1}}>
      <View onClick={this.run} ref='block' style={{width: 300, height: 300, backgroundColor: 'red'}}>transition</View>
      <View onClick={this.run} ref='block2' style={{width: 300, height: 300, backgroundColor: 'red'}}>timing</View>
    </View>
  }
}

render(<Demo/>)

```

## Demo

- 水平移动 [https://jsplayground.taobao.org/raxplayground/3f3ff9f5-a9c6-4ecd-a5f5-e66d819e4b8d](https://jsplayground.taobao.org/raxplayground/3f3ff9f5-a9c6-4ecd-a5f5-e66d819e4b8d)

