# XSlider  轮播增强

## 安装

```bash
$ npm install rax-xslider --save
```

## 引用

```jsx
import Slider from 'rax-xslider';
```


## API说明

### Slider

### 属性
|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|loop|Boolean|false|是否开启无缝轮播|
|autoPlay| Boolean | false|是否自动轮播|
|interval|Number |3000|开启`autoPlay`后间隔时间，单位`ms`|
|resumeInterval|Number|2000|手指离开后至开始autoPlay的间隔时间|
|duration|Number|300|切换的动画周期，单位ms|
|easing|String|cubicBezier(.25,.1,.25,1)|动画缓动函数|
|vertical| Boolean |false|是否是纵向|
|cardSize|Number|750|卡片宽度或者高度(vertical)|
|startGap|Number|0|卡片左(上)边边距|
|endGap|Number|0|卡片右(下)边边距|
|viewportSize|Number|undefined|视窗宽度(高度)|
|extraBindingProps|Array|[]|根据slider滑动所需进行的额外的binding效果 如：` [{element: this.refs.wrap,property: 'transform.translateX',expression:'x+0'}]` |
|cardTransitionSpec|Object|{}|卡片动画配置|
|beforeSwitch|Function|noop|切换到某个panel之前|
|afterSwitch | Function | noop |切换到某个panel之后|
|indicatorStyle|Object||导航器容器样式|
|indicatorItemStyle|Object||导航器选项样式|
|indicatorActiveItemStyle |Object||导航器当前选中项样式|
|indicatorComponent|Component|Indicator|自定义导航器组件，设置为`null`可以隐藏导航器|
|defaultIndex|Number|0|默认聚焦到第几个panel|
|minOffset|Number||滚动offset边界最小值(仅loop:false下生效)|
|maxOffset|Number||滚动offset边界最大值(仅loop:false下生效)|

### 方法

|名称|参数|返回值|描述|
|:---------------|:--------|:----|:----------|
|switchTo|(index, options)|{void}|切换到某个tab|
|stopAutoPlay||{void}|停止自动播放|
|stopAnimate||{void}|停止动画|

### 参数详解

#### index {Number} 索引

#### options

##### duration {Number}
动画周期，可覆盖全局duration

##### params
可携带自定义参数，在`beforeSwitch`和`afterSwitch`中通过`e.params`获取


### Slider.Panel

### 属性
|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onAppear|Function|noop|卡片处于可见区域时触发|
|onDisappear|Function|noop|卡片离开可见区域时触发|


### Slider.LoadMore
|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onLoading|Function|noop|在边到达缘时触发(loop需要设置为false)|


## 基本示例

```jsx
// demo
/** @jsx createElement */
import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Slider from 'rax-xslider';

const styles = {
  item: {
    height: 400,
    backgroundColor: 'red',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 5,
    borderColor: '#000'
  },
  txt: {
    color: '#fff',
    fontSize: 50,
    textAlign: 'center'
  },
  title: {
    backgroundColor: '#f7f7f7',
    color: '#444',
    textAlign: 'center',
    fontSize: 200,
    fontSize: 28,
    lineHeight: 80
  }
};

const colors = [
  'red',
  'green',
  'blue',
  'orange',
  'yellow'
];

class App extends Component {

  getCardTransitionSpec = () => {
    return {
      props: [
        {
          property: 'transform.scale',
          inputRange: [0, 1],
          outputRange: [0.8, 1]
        },
        {
          property: 'opacity',
          inputRange: [0, 1],
          outputRange: [.2, 1]
        }
      ]
    };
  }

  render() {
    return (<View style={{flex: 1}}>
      <Slider ref="slider"
              cardSize={600}
              startGap={75}
              endGap={75}
              autoPlay={true}
              loop={true}
              cardTransitionSpec={this.getCardTransitionSpec}
      >
        {colors.map((color, i) => {
          return (<Slider.Panel style={[styles.item, {backgroundColor: color}]}>
            <Text style={styles.txt}>{i}</Text>
          </Slider.Panel>);
        })}
      </Slider></View>);
  }
}


render(<App/>);




```



## DEMO

#### 常规使用

- [简单demo](https://jsplayground.taobao.org/raxplayground/017e13d3-8ae0-4f4c-b518-c7e428ce3a9e)
- [各api集合](https://jsplayground.taobao.org/raxplayground/39a7e6b0-ad40-4863-bcd4-45dcfbf8c205)
- [单屏垂直滚动demo](https://jsplayground.taobao.org/raxplayground/89924650-3a0d-4f1a-b644-7585bd4416a1)
- [marquee跑马灯demo](https://jsplayground.taobao.org/raxplayground/11301112-b62c-41cf-93e6-a5657a5b252e)
- [加载更多](https://jsplayground.taobao.org/raxplayground/41eb3d74-908d-4262-baf8-3af2ca826cd3)
- [onAppear,onDisappear事件](https://jsplayground.taobao.org/raxplayground/d7f65d08-82f6-4ace-8cb0-64df12807d78)
- [minOffset,maxOffset配置](https://jsplayground.taobao.org/raxplayground/7a3ebd1a-8b30-4ad5-897d-ab7dc444074d)

## 使用须知

* 安卓下需要配合`<Slider.PanView>`或者`<Slider.PanLink>`使用，分别替代`<View/>`和`<Link/>`标签，否则可能无法滑动






