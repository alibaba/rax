# 环境信息

通常我们的无线页面可能展示在不同的容器环境中，在某些情况下我们可能需要对环境进行判断。

## 判断运行平台

Rax Framework 参照 W3C 规范，提供了以下在 Weex 和 Web 环境一致的全局API, 我们可以通过 navigator 来获取页面的运行平台。

```jsx
navigator.platform  // iOS or Android
```

于此同时， `navigator` 还可以提供关于环境更加详细的信息, 例：

```jsx
navigator.product  // weex
navigator.appName // TB
navigator.appVersion // 6.4.1
```

## 判断运行容器

因为 Rax 为我们提供了跨容器的能力，我们的页面能够同时的运行在 Web 或 Weex 环境中。有时我们也需要判断运行容器，这时，我们可以通过 Env 组件来进行判断：

```jsx
import { isWeex, isWeb } from 'universal-env';
```

- isWeex 是否是 weex 环境
- isWeb 是否是 web 环境

## 获取屏幕信息

Rax Framework 提供了与 Web 一致的 CSS Object Model (CSSOM) View API：

- [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)

[https://drafts.csswg.org/cssom-view/#the-screen-interface](https://drafts.csswg.org/cssom-view/#the-screen-interface)

- screen.width
- screen.height
- screen.availWidth
- screen.availHeight
- screen.colorDepth
- screen.pixelDepth
