# 开发组件

### 组件的生命周期

在 Rax 中，组件拥有生命周期，多种方法在组件生命周期的特定点上被执行，其与在 React 中的概念是相同的：

#### 渲染阶段

- componentWillMount：该方法在首次渲染之前调用，也是在 `render` 方法调用之前修改 `state` 的最后一次机会。
- render：该方法会创建一个虚拟 DOM，用来表示组件的输出。对于一个组件来讲，`render` 方法是唯一一个必需的方法。`render`方法需要满足下面几点：
  1. 只能通过 `this.props` 和 this.state 访问数据（不能修改）
  2. 可以返回 `null` 或者任何 `Rax` 组件
  3. 可以返回一个顶级组件，也可以返回一组元素（数组）
  4. 不能改变组件的状态
  5. 不能修改真实节点的输出
- componentDidMount：该方法不会在服务端被渲染的过程中调用。该方法被调用时，页面中已经渲染出真实的节点。

#### 存在阶段

- componentWillReceiveProps：组件的 `props` 属性可以通过父组件来更改，这时，此方法将会被调用。可以在这个方法里更新 `state`，以触发 `render` 方法重新渲染组件。
- shouldComponentUpdate：如果你确定组件的 `props` 或者 `state` 的改变不需要重新渲染，可以通过在这个方法里通过返回 `false` 来阻止组件的重新渲染，返回 `false` 则不会执行 `render` 以及后面的 `componentWillUpdate`，`componentDidUpdate` 方法。该方法是非必须的，并且大多数情况下没有在开发中使用。
- componentWillUpdate：此方法和 `componentWillMount` 类似，在组件接收到了新的 `props` 或者 `state` 即将进行重新渲染前，`componentWillUpdate(object nextProps, object nextState)` 会被调用，**注意不要在此方面里再去更新 props 或者 state。**
- componentDidUpdate：此方法和 `componentDidMount` 类似，在组件重新被渲染之后，`componentDidUpdate(object prevProps, object prevState)` 会被调用。可以在这里访问并修改真实节点。

#### 销毁阶段

- componentWillUnmount：每当 `Rax` 使用完一个组件，这个组件必须从容器环境中卸载后被销毁，此时该 方法会被执行，完成所有的清理和销毁工作，在 `componentDidMount` 中添加的任务都需要再该方法中撤销，如创建的定时器或事件监听器。

### 组件的写法

Rax 是与 React 兼容的，所以 React 中支持的组件写法 Rax 也都支持。

#### ES6 类方式创建组件 （推荐）

每个组件都需要有一个 `render` 方法，用来接收数据然后返回要显示在页面上的内容。

```js
import { createElement, render, Component } from 'rax';
import Text from 'rax-text';

class Hello extends Component {
  render() {
    return <Text>Hello {this.props.name}</Text>;
  }
}

render(<Hello name="Taobao FED" />);
```

#### 无状态函数式组件

下面示例中的组件就仅仅是一个函数,组件本身没有状态：

```jsx
import { createElement, render, Component } from 'rax';
import Text from 'rax-text';

function Hello(props) {
  return <Text>Hello {props.name}</Text>;
}

render(<Hello name="Taobao FED" />);
```

#### 带状态(State)的组件

除了直接通过 `this.props` 拿到数据并展示，组件内部也可以维持自己的状态，通过 `this.state` 获取。
当一个组件的 `state` 改变的时候组件会重新渲染。

```jsx
import { createElement, render, Component } from 'rax';
import Text from 'rax-text';

class Clock extends Component {
  state = {
    time: Date.now(),
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const time = new Date(this.state.time).toLocaleTimeString();
    return <Text>{ time }</Text>;
  }
}

render(<Clock />);
```
