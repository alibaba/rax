# Top-level API

```js
import {createElement, ... , render} from 'rax';
```
* createElement(type, [props], [...children])
* cloneElement(element, [props], [...children])
* isValidElement(object)
* createFactory(type)
* Component
```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
* PureComponent
```js
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
    ```js
    MyComponent.propTypes = {
      requiredAny: PropTypes.any.isRequired,
    }
    ```
* findDOMNode(component)
> In most cases, you can attach a ref to the DOM node and avoid using findDOMNode at all.
* findComponentInstance(node)
```js
findComponentInstance(node) => // Component Instance Object
```
* setNativeProps(component, nativeProps)
> Use setNativeProps when necessary to make changes directly to a component without using state/props to trigger a re-render of the entire subtree.
  ```js
  setNativeProps(this.refs.testChild, {
    style: {
      opacity: 1
    }
  })
  ```
* render(element, [container], [callback])
```js
render(<Greeting />)
```
* unmountComponentAtNode(container)
