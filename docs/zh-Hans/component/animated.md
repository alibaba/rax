# Animated 动画

动画是现代用户体验中非常重要的一个部分，`Animated` 库就是用来创造流畅、强大、并且易于构建和维护的动画。


## 安装

```bash
$ npm install rax-animated --save
```

## 引用

```jsx
import Animated from 'rax-animated';
```

最简单的工作流程就是创建一个`Animated.Value`，把它绑定到组件的一个或多个样式属性上。然后可以通过动画驱动它，譬如`Animated.timing`，或者通过`Animated.event`把它关联到一个手势上，譬如拖动或者滑动操作。除了样式，`Animated.value`还可以绑定到props上，并且一样可以被插值。这里有一个简单的例子，一个容器视图会在加载的时候淡入显示：

```jsx

import {createElement, Component, render} from 'rax';
import Image from 'rax-image';
import Animated from 'rax-animated';

class FadeInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0), // init opacity 0
    };
  }
  componentDidMount() {
    Animated.timing(          // Uses easing functions
      this.state.fadeAnim,    // The value to drive
      {toValue: 1},           // Configuration
    ).start();                // Don't forget start!
  }
  render() {
    return (
      <Animated.View          // Special animatable View
        style={{opacity: this.state.fadeAnim}}> // Binds
        {this.props.children}
      </Animated.View>
    );
  }
}

// use it
render(
  <FadeInView>
  
      <Image source={{
          uri: 'https://gw.alicdn.com/tfs/TB1g6AvPVXXXXa7XpXXXXXXXXXX-215-215.png'
        }}
        style={{
          width: 100,
          height: 100,
        }}
        resizeMode="cover"
      />
      
    hello world
    
  </FadeInView>
);
```


 注意只有声明为可动画化的组件才能被关联动画。`View`、`Text`，还有`Image`都是可动画化的。如果你想让自定义组件可动画化，可以用`createAnimatedComponent`。这些特殊的组件里面用了一些黑魔法，来把动画数值绑定到属性上，然后在每帧去执行原生更新，来避免每次render和同步过程的开销。他们还处理了在节点卸载时的清理工作以确保使用安全。

 动画具备很强的可配置性。自定义或者预定义的过渡函数、延迟、时间、衰减比例、刚度等等。取决于动画类型的不同，你还可以配置更多的参数。

 一个`Animated.View`可以驱动任意数量的属性，并且每个属性可以配置一个不同的插值函数。插值函数把一个输入的范围映射到输出的范围，通常我们用线性插值，不过你也可以使用其他的过渡函数。默认情况下，当输入超出范围时，它也会对应的进行转换，不过你也可以把输出约束到范围之内。 

 举个例子，你可能希望你的`Animated.View`从0变化到1时，把组件的位置从150px移动到0px，不透明度从0到1。可以通过以下的方法修改`style`属性来实现：

```jsx
style={{
     opacity: this.state.fadeAnim, // Binds directly
     transform: [{
        translateY: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
       }),
     }],
}}>
```

 动画还可以被更复杂地组合，通过一些辅助函数例如`sequence`或者`parallel`（它们分别用于先后执行多个动画和同时执行多个动画），而且还可以通过把toValue设置为另一个Animated.Value来产生一个动画序列。

 `Animated.ValueXY`则用来处理一些2D动画，譬如滑动。并且还有一些辅助功能譬如`setOffset`和`getLayout`来帮助实现一些常见的交互效果，譬如拖放操作(Drag and drop)。

 你可以在`AnimationExample.js`中找到一些更复杂的例子。你还可以看看Gratuitous Animation App，以及[动画指南文档](animations.html)。

注意`Animated`模块被设计为可完全序列化的，这样动画可以脱离JavaScript事件循环，以一种高性能的方式运行。这可能会导致API看起来比较难懂，与一个完全同步的动画系统相比稍微有一些奇怪。`Animated.Value.addListener`可以帮助你解决一些相关限制，不过使用它的时候需要小心，因为将来的版本中它可能会牵扯到性能问题。

### 方法

- static decay(value: AnimatedValue | AnimatedValueXY, config: DecayAnimationConfig)

推动一个值以一个初始的速度和一个衰减系数逐渐变为0。

- static timing(value: AnimatedValue | AnimatedValueXY, config: TimingAnimationConfig) 

推动一个值按照一个过渡曲线而随时间变化。Easing模块定义了一大堆曲线，你也可以使用你自己的函数。

- static spring(value: AnimatedValue | AnimatedValueXY, config: SpringAnimationConfig) 

产生一个基于Rebound和Origami实现的Spring动画。它会在toValue值更新的同时跟踪当前的速度状态，以确保动画连贯。可以链式调用。

- static add(a: Animated, b: Animated) 

将两个动画值相加计算，创建一个新的动画值。

- static multiply(a: Animated, b: Animated) 

将两个动画值相乘计算，创建一个新的动画值。

- static delay(time: number) 

在指定的延迟之后开始动画。

- static sequence(animations: Array<CompositeAnimation>) 

按顺序执行一个动画数组里的动画，等待一个完成后再执行下一个。如果当前的动画被中止，后面的动画则不会继续执行。

- static parallel(animations: Array<CompositeAnimation>, config?: ParallelConfig) 

同时开始一个动画数组里的全部动画。默认情况下，如果有任何一个动画停止了，其余的也会被停止。你可以通过stopTogether选项来改变这个效果。

- static stagger(time: number, animations: Array<CompositeAnimation>) 

一个动画数组，里面的动画有可能会同时执行（重叠），不过会以指定的延迟来开始。用来制作拖尾效果非常合适。

- static event(argMapping: Array<Mapping>, config?: EventConfig) 

接受一个映射的数组，对应的解开每个值，然后调用所有对应的输出的setValue方法。例如：

```jsx
onScroll={this.AnimatedEvent(
	[{nativeEvent: {contentOffset: {x: this._scrollX}}}]
	{listener},          // 可选的异步监听函数
)
...
onPanResponderMove: this.AnimatedEvent([
	null,                // 忽略原始事件
	{dx: this._panX},    // 手势状态参数
]),
```
- static createAnimatedComponent(Component: any) 

使得任何一个React组件支持动画。用它来创建Animated.View等等。

### 属性
- Value: AnimatedValue 

表示一个数值的类，用于驱动动画。通常用new Animated.Value(0);来初始化。

- ValueXY: AnimatedValueXY 

表示一个2D值的类，用来驱动2D动画，例如拖动操作等。

## class AnimatedValue

用于驱动动画的标准值。一个`Animated.Value`可以用一种同步的方式驱动多个属性，但同时只能被一个行为所驱动。启用一个新的行为（譬如开始一个新的动画，或者运行`setValue`）会停止任何之前的动作。

### 方法

- constructor(value: number) 
- setValue(value: number) 

直接设置它的值。这个会停止任何正在进行的动画，然后更新所有绑定的属性。

- setOffset(offset: number) 

设置一个相对值，不论接下来的值是由setValue、一个动画，还是Animated.event产生的，都会加上这个值。常用来在拖动操作一开始的时候用来记录一个修正值（譬如当前手指位置和View位置）。

- flattenOffset() 

把当前的相对值合并到值里，并且将相对值设为0。最终输出的值不会变化。常在拖动操作结束后调用。

- addListener(callback: ValueListenerCallback) 

添加一个异步监听函数，这样你就可以监听动画值的变更。这有时候很有用，因为你没办法同步的读取动画的当前值，因为有时候动画会在原生层次运行。

- removeListener(id: string) 
- removeAllListeners() 
- stopAnimation(callback?: ?(value: number) => void) 

停止任何正在运行的动画或跟踪值。callback会被调用，参数是动画结束后的最终值，这个值可能会用于同步更新状态与动画位置。

- interpolate(config: InterpolationConfigType) 

在更新属性之前对值进行插值。譬如：把0-1映射到0-10。

- animate(animation: Animation, callback: EndCallback) 

一般仅供内部使用。不过有可能一个自定义的动画类会用到此方法。

- stopTracking() 

仅供内部使用。

- track(tracking: Animated) 

仅供内部使用。


## class AnimatedValueXY

用来驱动2D动画的2D值，譬如滑动操作等。API和普通的`Animated.Value`几乎一样，只不过是个复合结构。它实际上包含两个普通的`Animated.Value`。

例子：

```jsx
class DraggableView extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       pan: new Animated.ValueXY(), // inits to zero
     };
     this.state.panResponder = PanResponder.create({
       onStartShouldSetPanResponder: () => true,
       onPanResponderMove: Animated.event([null, {
         dx: this.state.pan.x, // x,y are Animated.Value
         dy: this.state.pan.y,
       }]),
       onPanResponderRelease: () => {
         Animated.spring(
           this.state.pan,         // Auto-multiplexed
           {toValue: {x: 0, y: 0}} // Back to zero
         ).start();
       },
     });
   }
   render() {
     return (
       <Animated.View
         {...this.state.panResponder.panHandlers}
         style={this.state.pan.getLayout()}>
         {this.props.children}
       </Animated.View>
     );
   }
 }
```

### 方法

- constructor(valueIn?: ?{x: number | AnimatedValue; y: number | AnimatedValue}) 
- setValue(value: {x: number; y: number}) 
- setOffset(offset: {x: number; y: number}) 
- flattenOffset() 
- stopAnimation(callback?: ?() => number) 
- addListener(callback: ValueXYListenerCallback) 
- removeListener(id: string) 
- getLayout() 

将一个{x, y}组合转换为{left, top}以用于样式。例如：

```jsx
style={this.state.anim.getLayout()}
getTranslateTransform() 
```

将一个{x, y} 组合转换为一个可用的位移变换(translation transform)，例如：

```jsx
style={{
  transform: this.state.anim.getTranslateTransform()
}}
```

### 例子

```jsx
'use strict';
import { render } from 'rax';
import Animated from 'rax-animated';
import Text from 'rax-text';
import View from 'rax-view';
import Easing from 'universal-easing';
import UIExplorerButton from './UIExplorerButton';

const styles = {
  content: {
    backgroundColor: 'deepskyblue',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
};

exports.framework = 'React';
exports.title = 'Animated - Examples';
exports.description = 'Animated provides a powerful ' +
  'and easy-to-use API for building modern, ' +
  'interactive user experiences.';

exports.examples = [
  {
    title: 'FadeInView',
    description: 'Uses a simple timing animation to ' +
      'bring opacity from 0 to 1 when the component ' +
      'mounts.',
    render: function() {
      class FadeInView extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            fadeAnim: new Animated.Value(0), // opacity 0
          };
        }
        componentDidMount() {
          Animated.timing(       // Uses easing functions
            this.state.fadeAnim, // The value to drive
            {
              toValue: 1,        // Target
              duration: 2000,    // Configuration
            },
          ).start();             // Don't forget start!
        }
        render() {
          return (
            <Animated.View   // Special animatable View
              style={{
                opacity: this.state.fadeAnim,  // Binds
              }}>
              {this.props.children}
            </Animated.View>
          );
        }
      }
      class FadeInExample extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            show: true,
          };
        }
        render() {
          return (
            <View>
              <UIExplorerButton onPress={() => {
                  this.setState((state) => (
                    {show: !state.show}
                  ));
                }}>
                Press to {this.state.show ?
                  'Hide' : 'Show'}
              </UIExplorerButton>
              {this.state.show && <FadeInView>
                <View style={styles.content}>
                  <Text>FadeInView</Text>
                </View>
              </FadeInView>}
            </View>
          );
        }
      }
      return <FadeInExample />;
    },
  },
  {
    title: 'Transform Bounce',
    description: 'One `Animated.Value` is driven by a ' +
      'spring with custom constants and mapped to an ' +
      'ordered set of transforms.  Each transform has ' +
      'an interpolation to convert the value into the ' +
      'right range and units.',
    render: function() {
      this.anim = this.anim || new Animated.Value(0);
      return (
        <View>
          <UIExplorerButton onPress={() => {
            Animated.spring(this.anim, {
              toValue: 0,   // Returns to the start
              velocity: 3,  // Velocity makes it move
              tension: -10, // Slow
              friction: 1,  // Oscillate a lot
            }).start(); }}>
            Press to Fling it!
          </UIExplorerButton>
          <Animated.View
            style={[styles.content, {
              transform: [   // Array order matters
                {scale: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 4],
                })},
                {translateX: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 500],
                })},
                {rotate: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    '0deg', '360deg' // 'deg' or 'rad'
                  ],
                })},
              ]}
            ]}>
            <Text>Transforms!</Text>
          </Animated.View>
        </View>
      );
    },
  },
  {
    title: 'Composite Animations with Easing',
    description: 'Sequence, parallel, delay, and ' +
      'stagger with different easing functions.',
    render: function() {
      this.anims = this.anims || [1,2,3].map(
        () => new Animated.Value(0)
      );
      return (
        <View>
          <UIExplorerButton onPress={() => {
            var timing = Animated.timing;
            Animated.sequence([ // One after the other
              timing(this.anims[0], {
                toValue: 200,
                easing: Easing.linear,
              }),
              Animated.delay(400), // Use with sequence
              timing(this.anims[0], {
                toValue: 0,
                easing: Easing.elastic(2), // Springy
              }),
              Animated.delay(400),
              Animated.stagger(200,
                this.anims.map((anim) => timing(
                  anim, {toValue: 200}
                )).concat(
                this.anims.map((anim) => timing(
                  anim, {toValue: 0}
                ))),
              ),
              Animated.delay(400),
              Animated.parallel([
                Easing.inOut(Easing.quad), // Symmetric
                Easing.back(1.5),  // Goes backwards first
                Easing.ease        // Default bezier
              ].map((easing, ii) => (
                timing(this.anims[ii], {
                  toValue: 320, easing, duration: 3000,
                })
              ))),
              Animated.delay(400),
              Animated.stagger(200,
                this.anims.map((anim) => timing(anim, {
                  toValue: 0,
                  easing: Easing.bounce, // Like a ball
                  duration: 2000,
                })),
              ),
            ]).start(); }}>
            Press to Animate
          </UIExplorerButton>
          {['Composite', 'Easing', 'Animations!'].map(
            (text, ii) => (
              <Animated.View
                style={[styles.content, {
                  left: this.anims[ii]
                }]}>
                <Text>{text}</Text>
              </Animated.View>
            )
          )}
        </View>
      );
    },
  },
  {
    title: 'Continuous Interactions',
    description: 'Gesture events, chaining, 2D ' +
      'values, interrupting and transitioning ' +
      'animations, etc.',
    render: () => (
      <Text>Checkout the Gratuitous Animation App!</Text>
    ),
  }
];

```
