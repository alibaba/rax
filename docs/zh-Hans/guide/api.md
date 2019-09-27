# 全局 API 参考
本文档提供 Rax 开发环境下的全局 API 以及 Rax 包自身 API。

## 环境 API
`Rax Framework` 参照 W3C 规范，提供了以下在 Weex 和 Web 环境一致的全局API:

（Weex版本>=0.9.5下可用，对应手淘版本>=6.4.0）

* `CSS Font Loading API`
    * Class FontFace
    * document.fonts.add

```jsx
var bitterFontFace = new FontFace('Bitter', 'url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)');
document.fonts.add(bitterFontFace);
var oxygenFontFace = new FontFace('Oxygen', 'url(https://fonts.gstatic.com/s/oxygen/v5/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2)');
document.fonts.add(oxygenFontFace);
```

* `Window Object API`
    * [self](https://developer.mozilla.org/en-US/docs/Web/API/Window/self)
    * alert
    * requestAnimationFrame()
    * cancelAnimationFrame()
    * [window.name](https://developer.mozilla.org/en-US/docs/Web/API/Window/name)
    * window.location
    * window.postMessage()
    * window.open()
    * [window.closed](https://developer.mozilla.org/en-US/docs/Web/API/Window/closed)
* `Timers API`
    * setTimeout()
    * clearTimeout()
    * setInterval()
    * clearInterval()
* `Base64 utility methods`
    * ~~[atob()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob)~~ 暂未支持
    * ~~[btoa()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa)~~ 暂未支持
* `CSS Object Model (CSSOM) View API`
    * [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
    * screen
        * width
        * height
        * availWidth
        * availHeight
        * colorDepth
        * pixelDepth
* `Document Object Model`
    * addEventListener()
    * removeEventListener()
    * dispatchEvent()
* `Client identification API`
    * navigator.platform
      * 平台信息，Weex 下支持分辨 `iOS`、`Android`，Web 下表现同浏览器
    * navigator.product
    * navigator.appName
    * navigator.appVersion
* [`Performance API`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance)
    * performance.timing
    * performance.now()
* `Fetch API`
    * Class [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
    * Class [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
    * Class [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
    * [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
* `URL API`
    * Class [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
        * href
        * origin
        * searchParams
        * toString()
    * Class [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
        * append()
        * delete()
        * entries()
        * get()
        * getAll()
        * has()
        * keys()
        * set()
        * values()
        * toString()
* `location`
    * location.hash
    * location.search
    * location.pathname
    * location.port
    * location.hostname
    * location.host
    * location.protocol
    * location.origin
    * location.href
    * location.assign
    * location.replace
    * location.reload

## Rax API
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
