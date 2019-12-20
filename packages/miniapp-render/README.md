# miniprogram-render

## 介绍

这是一个 dom 环境模拟工具，它为小程序而设计，用于提供 dom 接口给开发者使用。

> 可以认为这是一个跑在小程序 appService 上的一个超轻量级 jsDom

## 安装

```
npm install --save miniprogram-render
```

## 使用

```js
const mp = require('miniprogram-render')

```js
Page({
    onLoad() {
        // 创建页面
        const { pageId, window, document } = mp.createPage(this.route, config)
        this.pageId = pageId

        // 设置页面的 url
        window.$$miniprogram.setRealUrl('http://test.miniprogram.com')
        // 初始化页面
        window.$$miniprogram.init()
    },
    onUnload() {
        // 销毁页面
        mp.destroyPage(this.pageId)
    },
})
```

## 接口

### createPage(route, config)

创建页面。

| 参数 | 类型 | 描述 |
|---|---|---|
| route | String | 页面路由，即小程序页面实例的 route 属性 |
| config | Object | 页面全局配置，这个配置是小程序维度的，所有页面都共用一个 config 对象，每次创建页面传入的 config 会覆盖当前已有的 config 对象 |

```js
const page1 = mp.createPage('/pages/home/index', config1) // 传入 config1
const page2 = mp.createPage('/pages/home/index', config2) // 传入 config2

// 后传入的 config2 会覆盖 config1，即所有页面都会使用 config2，config1 相当于被废弃的，不会再被使用到
```

> PS：config 的覆盖规则设计是为了保证多个页面能共用一份配置，以确保页面的表现一致

### destroyPage(pageId)

销毁页面。
