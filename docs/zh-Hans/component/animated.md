# Animated

动画是现代用户体验中非常重要的一个部分，`Animated`库就是用来创造流畅、强大、并且易于构建和维护的动画。


## 安装

```bash
$ npm install rax-animated --save
```

## 引用

```jsx
import Button from 'rax-animated';
```

最简单的工作流程就是创建一个`Animated.Value`，把它绑定到组件的一个或多个样式属性上。然后可以通过动画驱动它，譬如`Animated.timing`，或者通过`Animated.event`把它关联到一个手势上，譬如拖动或者滑动操作。除了样式，`Animated.value`还可以绑定到props上，并且一样可以被插值。这里有一个简单的例子，一个容器视图会在加载的时候淡入显示：

```javascript
class FadeInView extends React.Component {
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
 ```


 注意只有声明为可动画化的组件才能被关联动画。`View`、`Text`，还有`Image`都是可动画化的。如果你想让自定义组件可动画化，可以用`createAnimatedComponent`。这些特殊的组件里面用了一些黑魔法，来把动画数值绑定到属性上，然后在每帧去执行原生更新，来避免每次render和同步过程的开销。他们还处理了在节点卸载时的清理工作以确保使用安全。

 动画具备很强的可配置性。自定义或者预定义的过渡函数、延迟、时间、衰减比例、刚度等等。取决于动画类型的不同，你还可以配置更多的参数。

 一个`Animated.Value`可以驱动任意数量的属性，并且每个属性可以配置一个不同的插值函数。插值函数把一个输入的范围映射到输出的范围，通常我们用线性插值，不过你也可以使用其他的过渡函数。默认情况下，当输入超出范围时，它也会对应的进行转换，不过你也可以把输出约束到范围之内。 

 举个例子，你可能希望你的`Animated.Value`从0变化到1时，把组件的位置从150px移动到0px，不透明度从0到1。可以通过以下的方法修改`style`属性来实现：

 ```javascript
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

<div class="props">
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="decay"></a><span class="propType">static </span>decay<span class="propType">(value: AnimatedValue | AnimatedValueXY, config: DecayAnimationConfig)</span> <a class="hash-link" href="#decay">#</a></h4>
		<div>
			<p>推动一个值以一个初始的速度和一个衰减系数逐渐变为0。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="timing"></a><span class="propType">static </span>timing<span class="propType">(value: AnimatedValue | AnimatedValueXY, config: TimingAnimationConfig)</span> <a class="hash-link" href="#timing">#</a></h4>
		<div>
			<p>推动一个值按照一个过渡曲线而随时间变化。<code>Easing</code>模块定义了一大堆曲线，你也可以使用你自己的函数。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="spring"></a><span class="propType">static </span>spring<span class="propType">(value: AnimatedValue | AnimatedValueXY, config: SpringAnimationConfig)</span> <a class="hash-link" href="#spring">#</a></h4>
		<div>
			<p>产生一个基于Rebound和Origami实现的Spring动画。它会在<code>toValue</code>值更新的同时跟踪当前的速度状态，以确保动画连贯。可以链式调用。</p>
		</div>
	</div>
	<div class="prop"><h4 class="propTitle"><a class="anchor" name="add"></a><span class="propType">static </span>add<span class="propType">(a: Animated, b: Animated)</span> <a class="hash-link" href="#add">#</a></h4><div>
	<p>将两个动画值相加计算，创建一个新的动画值。</p></div></div>
<div class="prop"><h4 class="propTitle"><a class="anchor" name="multiply"></a><span class="propType">static </span>multiply<span class="propType">(a: Animated, b: Animated)</span> <a class="hash-link" href="#multiply">#</a></h4><div>
<p>将两个动画值相乘计算，创建一个新的动画值。</p></div></div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="delay"></a><span class="propType">static </span>delay<span class="propType">(time: number)</span> <a class="hash-link" href="#delay">#</a></h4>
		<div>
			<p>在指定的延迟之后开始动画。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="sequence"></a><span class="propType">static </span>sequence<span class="propType">(animations: Array&lt;CompositeAnimation&gt;)</span> <a class="hash-link" href="#sequence">#</a></h4>
		<div>
			<p>按顺序执行一个动画数组里的动画，等待一个完成后再执行下一个。如果当前的动画被中止，后面的动画则不会继续执行。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="parallel"></a><span class="propType">static </span>parallel<span class="propType">(animations: Array&lt;CompositeAnimation&gt;, config?: ParallelConfig)</span> <a class="hash-link" href="#parallel">#</a></h4>
		<div>
			<p>同时开始一个动画数组里的全部动画。默认情况下，如果有任何一个动画停止了，其余的也会被停止。你可以通过<code>stopTogether</code>选项来改变这个效果。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="stagger"></a><span class="propType">static </span>stagger<span class="propType">(time: number, animations: Array&lt;CompositeAnimation&gt;)</span> <a class="hash-link" href="#stagger">#</a></h4>
		<div>
			<p>一个动画数组，里面的动画有可能会同时执行（重叠），不过会以指定的延迟来开始。用来制作拖尾效果非常合适。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="event"></a><span class="propType">static </span>event<span class="propType">(argMapping: Array&lt;Mapping&gt;, config?: EventConfig)</span> <a class="hash-link" href="#event">#</a></h4>
		<div>
			<p>接受一个映射的数组，对应的解开每个值，然后调用所有对应的输出的<code>setValue</code>方法。例如：</p>
			<pre><code class="lang-javascript"> onScroll={<span class="hljs-keyword">this</span>.AnimatedEvent(
   [{nativeEvent: {contentOffset: {x: <span class="hljs-keyword">this</span>._scrollX}}}]
   {listener},          <span class="hljs-comment">// 可选的异步监听函数</span>
 )
 ...
 onPanResponderMove: <span class="hljs-keyword">this</span>.AnimatedEvent([
   <span class="hljs-literal">null</span>,                <span class="hljs-comment">// 忽略原始事件</span>
   {dx: <span class="hljs-keyword">this</span>._panX},    <span class="hljs-comment">// 手势状态参数</span>
 ]),
</code></pre>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="createanimatedcomponent"></a><span class="propType">static </span>createAnimatedComponent<span class="propType">(Component: any)</span> <a class="hash-link" href="#createanimatedcomponent">#</a></h4>
		<div>
			<p>使得任何一个React组件支持动画。用它来创建<code>Animated.View</code>等等。</p>
		</div>
	</div>
</div>

### 属性

<div class="props">
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="value"></a>Value<span class="propType">: AnimatedValue</span> <a class="hash-link" href="#value">#</a></h4>
		<div>
			<p>表示一个数值的类，用于驱动动画。通常用<code>new Animated.Value(0);</code>来初始化。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="valuexy"></a>ValueXY<span class="propType">: AnimatedValueXY</span> <a class="hash-link" href="#valuexy">#</a></h4>
		<div>
			<p>表示一个2D值的类，用来驱动2D动画，例如拖动操作等。</p>
		</div>
	</div>
</div>

## class AnimatedValue

用于驱动动画的标准值。一个`Animated.Value`可以用一种同步的方式驱动多个属性，但同时只能被一个行为所驱动。启用一个新的行为（譬如开始一个新的动画，或者运行`setValue`）会停止任何之前的动作。

### 方法

<div class="props">
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="constructor"></a>constructor<span class="propType">(value: number)</span> <a class="hash-link" href="#constructor">#</a></h4>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="setvalue"></a>setValue<span class="propType">(value: number)</span> <a class="hash-link" href="#setvalue">#</a></h4>
		<div>
			<p>直接设置它的值。这个会停止任何正在进行的动画，然后更新所有绑定的属性。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="setoffset"></a>setOffset<span class="propType">(offset: number)</span> <a class="hash-link" href="#setoffset">#</a></h4>
		<div>
			<p>设置一个相对值，不论接下来的值是由<code>setValue</code>、一个动画，还是<code>Animated.event</code>产生的，都会加上这个值。常用来在拖动操作一开始的时候用来记录一个修正值（譬如当前手指位置和View位置）。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="flattenoffset"></a>flattenOffset<span class="propType">()</span> <a class="hash-link" href="#flattenoffset">#</a></h4>
		<div>
			<p>把当前的相对值合并到值里，并且将相对值设为0。最终输出的值不会变化。常在拖动操作结束后调用。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="addlistener"></a>addListener<span class="propType">(callback: ValueListenerCallback)</span> <a class="hash-link" href="#addlistener">#</a></h4>
		<div>
			<p>添加一个异步监听函数，这样你就可以监听动画值的变更。这有时候很有用，因为你没办法同步的读取动画的当前值，因为有时候动画会在原生层次运行。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="removelistener"></a>removeListener<span class="propType">(id: string)</span> <a class="hash-link" href="#removelistener">#</a></h4>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="removealllisteners"></a>removeAllListeners<span class="propType">()</span> <a class="hash-link" href="#removealllisteners">#</a></h4>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="stopanimation"></a>stopAnimation<span class="propType">(callback?: ?(value: number) =&gt; void)</span> <a class="hash-link" href="#stopanimation">#</a></h4>
		<div>
			<p>停止任何正在运行的动画或跟踪值。<code>callback</code>会被调用，参数是动画结束后的最终值，这个值可能会用于同步更新状态与动画位置。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="interpolate"></a>interpolate<span class="propType">(config: InterpolationConfigType)</span> <a class="hash-link" href="#interpolate">#</a></h4>
		<div>
			<p>在更新属性之前对值进行插值。譬如：把0-1映射到0-10。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="animate"></a>animate<span class="propType">(animation: Animation, callback: EndCallback)</span> <a class="hash-link" href="#animate">#</a></h4>
		<div>
			<p>一般仅供内部使用。不过有可能一个自定义的动画类会用到此方法。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="stoptracking"></a>stopTracking<span class="propType">()</span> <a class="hash-link" href="#stoptracking">#</a></h4>
		<div>
			<p>仅供内部使用。</p>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="track"></a>track<span class="propType">(tracking: Animated)</span> <a class="hash-link" href="#track">#</a></h4>
		<div>
			<p>仅供内部使用。</p>
		</div>
	</div>
</div>

## class AnimatedValueXY

用来驱动2D动画的2D值，譬如滑动操作等。API和普通的`Animated.Value`几乎一样，只不过是个复合结构。它实际上包含两个普通的`Animated.Value`。

例子：

```javascript
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

<div class="props">
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="constructor"></a>constructor<span class="propType">(valueIn?: ?{x: number | AnimatedValue; y: number | AnimatedValue})</span> <a class="hash-link" href="#constructor">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="setvalue"></a>setValue<span class="propType">(value: {x: number; y: number})</span> <a class="hash-link" href="#setvalue">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="setoffset"></a>setOffset<span class="propType">(offset: {x: number; y: number})</span> <a class="hash-link" href="#setoffset">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="flattenoffset"></a>flattenOffset<span class="propType">()</span> <a class="hash-link" href="#flattenoffset">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="stopanimation"></a>stopAnimation<span class="propType">(callback?: ?() =&gt; number)</span> <a class="hash-link" href="#stopanimation">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="addlistener"></a>addListener<span class="propType">(callback: ValueXYListenerCallback)</span> <a class="hash-link" href="#addlistener">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="removelistener"></a>removeListener<span class="propType">(id: string)</span> <a class="hash-link" href="#removelistener">#</a></h4>

	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="getlayout"></a>getLayout<span class="propType">()</span> <a class="hash-link" href="#getlayout">#</a></h4>
		<div>
			<p>将一个<code>{x, y}</code>组合转换为<code>{left, top}</code>以用于样式。例如：</p>
			<pre><code class="lang-javascript"> style={<span class="hljs-keyword">this</span>.state.anim.getLayout()}
</code></pre>
		</div>
	</div>
	<div class="prop">
		<h4 class="propTitle"><a class="anchor" name="gettranslatetransform"></a>getTranslateTransform<span class="propType">()</span> <a class="hash-link" href="#gettranslatetransform">#</a></h4>
		<div>
			<p>将一个<code>{x, y}</code> 组合转换为一个可用的位移变换(translation transform)，例如：</p>
			<pre><code class="lang-javascript"> style={{
   transform: <span class="hljs-keyword">this</span>.state.anim.getTranslateTransform()
 }}
</code></pre>
		</div>
	</div>
</div>

 ### 例子

 ```javascript
 
 'use strict';

var React = require('react-native');
var {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} = React;
var UIExplorerButton = require('./UIExplorerButton');

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

var styles = StyleSheet.create({
  content: {
    backgroundColor: 'deepskyblue',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
 ```