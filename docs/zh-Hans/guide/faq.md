# FAQ

## 1. 可以使用 className 吗？

如下的例子在浏览器里也能正常运行，是不是在 RAX 里也能用 className？

```jsx
import {createElement, render, Component} from 'rax';
import Text from 'rax-text';
 
class Hello extends Component {
  render() {
    return <Text className="hi">Hello {this.props.name}</Text>;
  }
}
 
render(<Hello name="FED" />, 'body');
```
Rax 的目标是跨容器的渲染，className只在Web容器下才会生效，但在 Weex 容器下无法支持，通常是不推荐使用 className。

但容器间存在功能差异，如必须使用某一个容器才具备的能力，如通过 className 来增强，此时如需增强 Web 下的能力必须加环境判断前置：

```jsx
import {createElement, render, Component} from 'rax';
import Text from 'rax-text';
import {isWeex, isWeb} from 'universal-env';
 
class Hello extends Component {
  render() {
    let props = {};
    if (isWeb) {
      props.className= "hi";
    }
    return <Text {...props}>Hello {this.props.name}</Text>;
  }
}
```

## 2.为什么 Rax 未支持 createClass？

React 支持 createClass 方式创建类，但 Rax 却只支持 ES6 类方式，是不是偷懒？ Rax 在技术上实现 createClass 并不难也不费劲，没有支持最重要原因是： ES6 类方式是 createClass 的替代方式，没有必要并存，React 在不久的未来也会废弃 createClass。 所以在团队 React 规范里我们也是禁止使用 createClass 的方式。

使用 ES6 类方式与原先使用 createClass 在 API 上没有太大差异，唯一区别是 ES6 类方式不支持 getInitialState。 因此当需要设置初始状态值时，可通过在类构造器中设置 state 属性的初始状态值。 其他的区别是 contextTypes、propTypes 与 defaultProps (替换原先的getDefaultProps) 在 ES6 类方式中是类的静态属性。 其中 props 与 context 通过类的构造器传入。

此外原先通过 createClass 创建的组件会自动将全部方法的 this 绑定到组件实例，可直接将方法传入` <div onClick={this.tick}> `。 在标准的类方式中我们需要显示的绑定 this, 所以在设置 onClick 时需通过 `this.tick.bind(this)` 绑定 this 至组件实例。

```jsx
import {createElement, Component} from 'rax';
 
class Counter extends Component {
  constructor(props, context) {
    // 需显式调用父类构造器 
    super(props, context);
    this.state = {count: props.initialCount};
    // 手动绑定 
    this.tick = this.tick.bind(this);
  }
  tick() {
    this.setState({count: this.state.count + 1});
  }
  render() {
    return (
      <div onClick={this.tick}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
 
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };
```

通过使用 ES7 支持的类属性初始化方式可以简化组件的定义，类属性初始化是在类构造器阶段中执行，此时 this 指向的是实例本身， 所以在初始 state 时可以直接使用 `this.props`。

类属性初始化方式结合箭向函数拥有词法作用域的 this 值特性（不产生自己作用域下 this），可以简化手动绑定的方式。

```jsx
import {createElement, Component} from 'rax';
 
class Counter extends Component {
 
  static defaultProps = {
    initialCount: 0,
  }
 
  static propTypes = {
    initialCount: React.PropTypes.number,
  }
 
  state = {
    count: this.props.initialCount,
  }
 
  tick = (e) => {
    this.setState({count: this.state.count + 1});
  }
 
  render() {
    return (
      <div onClick={this.tick}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
```

## 3.为什么事件回调函数推荐写成 箭向函数 方式？

我们从如下代码讲起，当点击Button时，发现报 找不到 printHi 方法 错误，为什么呢？

```jsx
import {createElement, Component} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import styles from './styles.css';
 
class App extends Component {
  pressHandler(){
    // 报错！！！找不到 printHi 方法 
    this.printHi();
  }
 
  printHi(){
    console.log('Hi');
  }
 
  render(){
    return <Button onPress={this.pressHandler}>Click Me</Button>
  }
}
```

当点击Button触发pressHandler时，此时`this.printHi`的this指向的是Button本身，并不是App这个实例。 自然你会想到使用bind来固定上下文，但在render内绑定函数上下文会导致一个性能问题，当render重新被执行时， 每一次`this.pressHandler.bind(this)`后的函数是不相等的，即onPress每次都接收了不同的参数，虽然是同一个pressHandler，但也会理解为不同的参数内容，导致Button重新被渲染。

```jsx
render(){
  return <Button onPress={this.pressHandler.bind(this)}>Click Me</Button>
}
```

所以推荐的方式使用 箭向函数 来书写 pressHandler, 利用 箭向函数 会自动绑定 this 为定义时所在的上下文的特点：

```jsx
pressHandler = () => {
  // 报错！！！找不到 printHi 方法 
  this.printHi();
}
 
render(){
  return <Button onPress={this.pressHandler}>Click Me</Button>
}
```
