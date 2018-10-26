# sfc2mp

> `sfc2mp` 是一个使用 SFC 语法开发小程序的辅助工具。

通过离线构建的方式，将 SFC 项目转换成一个小程序项目，包含构建和运行时部分，其中运行时使用了标准的 Vue 来实现。

## 安装

```bash
$ npm install sfc2mp -g
```

## 命令行说明

- `sfc2mp build` 将项目转换到目标小程序
- `sfc2mp watch` 实时监听文件变动，用于实时开发调试使用

参数说明

- `--target <target>` 设置目标转换类型 ali/wx (default: ali)
  - `ali` 支付宝小程序
  - `wx` 微信小程序
- `--output <output>` 设置转换后的文件夹名 (default: dist)

示例

```bash
sfc2mp build --output=weixin-dist --target=wx # 转成微信可运行的小程序
```

```bash
sfc2mp build # 转成支付宝可运行的小程序
```

## 快速开始

### 1. 初始化 SFC 项目

使用 [Taobao-Editor](https://developers.taobao.net/ide) 初始化一个轻应用项目。

**或者**下载[示例工程](https://gw.alicdn.com/bao/uploaded/TB1HD7jkPDpK1RjSZFrXXa78VXa.zip)并解压到一个独立的文件夹中，或者使用下面的命令

```bash
$ wget https://gw.alicdn.com/bao/uploaded/TB1HD7jkPDpK1RjSZFrXXa78VXa.zip -O sfc-example.zip
$ unzip sfc-example.zip
```

### 2. 运行 sfc2mp

打开终端并切换到项目目录，执行以下命令

```bash
$ sfc2mp build
```

看到 `Compile completed.` 字样后说明已经成功运行

![](https://gw.alicdn.com/tfs/TB1ejKsIHSYBuNjSspiXXXNzpXa-1546-1278.png)

### 3. 小程序预览

使用[蚂蚁小程序开发者工具](https://docs.alipay.com/mini/ide/download)打开当前目录下的 dist 目录

![](https://gw.alicdn.com/tfs/TB1lrhdIFGWBuNjy0FbXXb4sXXa-2080-1548.png)

## 主要特性

使用 sfc2mp 开发小程序，你将在小程序技术体系的基础上获取到这样一些能力：

- 彻底的组件化开发能力：提高代码复用性
- 完整的 SFC DSL 开发体验
- 目前已支持支付宝小程序的开发

更多特性可以参考 [SFC 框架文档](https://developers.taobao.net/components/)

## 生命周期

与 [SFC 的生命周期](https://developers.taobao.com/framework/light-framework/lifecycle.html)一样，sfc2mp 在应用级(app)、页面(page)、支持所有的组件级生命周期。

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

### app 级生命周期

在应用级监听生命周期的使用方式为，在 app.js 中加入以下代码

```js
import app from '@core/app';
app.on('launch', callback);
```

**应用所具有的生命周期：**

| 属性   | 类型     | 描述           | 触发时机                               |
| ------ | -------- | -------------- | -------------------------------------- |
| launch | Function | 监听程序初始化 | 当程序初始化完成时触发，全局只触发一次 |
| show   | Function | 监听程序显示   | 当程序启动，或从后台进入前台显示时触发 |
| hide   | Function | 监听程序隐藏   | 当程序从前台进入后台时触发             |
| error  | Function | 监听程序错误   | 当程序发生 js 错误时触发               |

### page 级生命周期

在页面级监听生命周期的使用方式为，在页面的 js 文件中加入以下代码

```js
import page from '@core/page';
page.on('load', callback);
```

**页面所具有的生命周期：**

| 属性   | 类型     | 说明             | 触发时机                                 |
| ------ | -------- | ---------------- | ---------------------------------------- |
| load   | Function | 监听页面加载     | 当页面初次加载时触发                     |
| unload | Function | 监听页面被关闭   | 当页面被销毁时触发                       |
| show   | Function | 监听程序显示     | 页面加载时或程序从后台进入前台显示时触发 |
| hide   | Function | 监听程序隐藏     | 当程序从前台进入后台时触发               |
| ready  | Function | 监听页面加载完成 | 当页面加载完成时触发                     |
| hide   | Function | 监听页面隐藏     | 当程序从前台进入后台时触发               |

## 暂未支持的轻框架语法

以下特性暂时还未支持，我们也在持续更新以支持标准的轻框架特性

1. slot
2. CSS 伪类、伪元素

> 本文档处于持续更新状态，请以本页面最新内容为准
