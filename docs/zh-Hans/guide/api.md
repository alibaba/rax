# API

```jsx
import {createElement, ... , render} from 'rax';
```
* createElement(type, [props], [...children])
* cloneElement(element, [props], [...children])
* isValidElement(object)
* createFactory(type)
* Component
```jsx
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
* PureComponent
```jsx
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
* PropTypes
  * PropTypes.array
  * PropTypes.bool
  * PropTypes.func
  * PropTypes.number
  * PropTypes.object
  * PropTypes.symbol
  * PropTypes.node
  * PropTypes.element
  * PropTypes.any
  * PropTypes.instanceOf()
  * PropTypes.oneOf()
  * PropTypes.oneOfType()
  * PropTypes.arrayOf()
  * PropTypes.objectOf()
  * PropTypes.shape()
  * propType.isRequired
    ```jsx
    MyComponent.propTypes = {
      requiredAny: PropTypes.any.isRequired,
    }
    ```
* findDOMNode(component)
> 通常情况下，你可以附加一个 REF 的 DOM 节点，避免使用 findDOMNode。
* findComponentInstance(node)
```jsx
findComponentInstance(node) => // Component Instance Object
```
* setNativeProps(component, nativeProps)
> 不使用 state/props 的情况下，直接使用 setNativeProps 去触发重新渲染
```jsx
  setNativeProps(this.refs.testChild, {
    style: {
      opacity: 1
    }
  })
```
* render(element, [container], [callback])
```jsx
render(<Greeting />)
```
* unmountComponentAtNode(container)
