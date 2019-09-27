---
title: Rax 0.5 发布
date: 20171213
author: 亚城
---

# Rax 0.5 发布

![](https://gw.alicdn.com/tfs/TB1jt2NgBTH8KJjy0FiXXcRsXXa-745-325.jpg)


## 一些数据
本数据截止 2017 年 12 月初，Rax 的建设方向重点逐渐转向阿里内部体系，github 上的增长数据如下

* 1669 commits
* 257 pull requests
* 85 issues
* 3751 stars

## 服务体系

### Rax 机器人

钉钉大群新添了一个答疑小能手，也许未来他就是 Rax 的百科全书

![](https://gw.alicdn.com/tfs/TB1illlhxrI8KJjy0FpXXb5hVXa-470-259.jpg)

### 汇总各团队的 Rax 组件体系

不同 BU 建设的组件体系，大放异彩

![](https://gw.alicdn.com/tfs/TB1YV4EgNrI8KJjy0FpXXb5hVXa-963-846.jpg_500x500.jpg)

## 核心库 changelog

* slider 
  * fix: rax-slider loop not work on web
  * fix: add loop in slider weex
* scrollview 
  * fix: scrollview scrollTo width animation in web
* unit-style 
  * fix: rem unit in style only one global val
* weex framework 
  * fix: set default value with forceReload param（reload 默认值）
  * fix: 为weex下增加w3c标准的onerror API
  * feat: remove updateFinish in framework
  * feat: __weex_module_supports__ and __weex_tag_supports__
  * feat: add https for url & reset require.weex.js
  * feat: reset weex jsfrm code
  * fix: rename weex.requireModule
  * feat: fireEvent params
  * feat: add __weex_config__ for js service
  * feat: add window.close
  * feat: pass weex options to native
* driver-browser 
  * fix: webkitFlexWrap for android
  * feat: add eventRegistry
  * fix: some node property is readonly when in strict mode 
  * feat: export deviceWidth and viewportWidth option in render
* jsonp 
  * fix: solve the 'Uncaught ReferenceError: callback_*** is not defined'…
* server-renderer 
  * fix: server-renderer context is incorrect
  * feat: export hydrate for server-side render
  * refactor: server-side render
  * perf: revert memoize createOpenTagMarkup
* switch 
  * fix: delete onTintColor for chrome error
* web framework 
  * feat: add Number.isNaN polyfill in web framework
  * chore: performance optimization
  * feat: add IntersectionObserver
  * fix: remove the last arg when has weex options
* waterfall 
  * fix: waterfall render header both conditions
* listview 
  * fix: Refresh in Listview
* tabheader 
  * feat: add selectInternal for tabheader
* picker 
  * fix: set picker date by change api
* script 
  * chore: dist compile globalName
* checkbox
  * fix: IntersectionObserverEntry has not isIntersecting in a lower vers…  …
  * fix: internalChecked value error in checkbox
* rax
  * fix: children api
  * feat: memoized node to html
  * fix: fix-rax-packagejson
  * fix: throw error when options is null
  * feat: make unstable_renderSubtreeIntoContainer parent param work
  * fix: addEventListener
  * feat: add addEvent params
  * fix: export default rax and rax.Children
  * refactor: find error boundary
  * fix: spelling error
  * refactor: componentDidCatch
  * fix: sync renderedChildren state when at init not at end
* stylesheet-loader
  * refactor: rename some method and val name
* countdown
  * fix: show number in countdown
* rax-dom
  * fix: only string should throw error in rax-dom
  * feat: findDOMNode in rax-dom not accept string
  * fix: render twice throw driver not found error
  * feat: rax-dom simple shim unstable_renderSubtreeIntoContainer
* weex-driver
  * feat: Spelling errorparams
* babel-preset-rax
  * feat: add BABEL_NO_ADD_MODULE_EXPORTS env config
* appstate
  * feat: add universal-appstate
* multirow
  * fix: multirow render bug
* picture
  * fix: optimized picture loading performance in h5
* charts
  * refactor: pie color accept arrays
  * feat(rax-charts): 修复rax-charts的color属性不支持多参数的问题
* textinput
  * feat: textinput export propTypes
  * feat: add defaultValue for TextInput
* transition
  * rem单位处理，callback不执行bugfix
* recyclerview
  * fix: children is null in recyclerview bug
  * fix: add scroll animated in list
  * fix: firstNodePlaceholder place in recyclerview
  * fix: refresh in recyclerview for andorid
  * fix: recylerview not rewrite ref
  * fix: first child can be null
  * fix: scrollTo not work when cell0 is RefreshControl in Android
* scrollview
  * fix: remove transform style in scrollview
  * fix: scrollview defaultStyle for root View in h5
* barcode
  * fix: add barWidth to props
* link
  * fix: only text style for <Text /> in Link component
* counter
  * fix: num 0 error in weex & add onchange api
* gotop
  * fix: appear cant work in Android Weex 0px height view

现在 Rax 已经应用的越来越广泛，Rax 的建设也更需要更多人的力量，欢迎贡献您的想法到 [这里](https://github.com/alibaba/rax) ～