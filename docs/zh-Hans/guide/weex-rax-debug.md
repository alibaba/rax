# 如何搭建 weex rax framework 调试环境
## 更新及打包

### Clone weex 仓库以及安装依赖

```bash
git clone https://github.com/apache/incubator-weex.git
cd incubator-weex
npm install
```

###  安装 `weex-rax-framework` 到本地

```sh
npm install weex-rax-framework
```
或

```sh
npm link weex-rax-framework
```

###  配置 `weex-rax-framework`

如下修改 `html5/frameworks/index.js` 文件

```js
import * as Weex from './legacy/index'
import Rax from 'weex-rax-framework'

export default {
  Rax,
  Weex
}
```

### 为 native renderer 构建 `dist/native.js`

```sh
npm run build:native
```

### 复制 `dist/native.js` 到 `weex-sdk`

```sh
cp -vf ./dist/native.js ./android/sdk/assets/main.js
cp -vf ./dist/native.js ./ios/sdk/WeexSDK/Resources/main.js
```

## Weex playground 环境准备

* 安装 Node.js 4.0+
* iOS 环境要求： [Environment](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppStoreDistributionTutorial/Setup/Setup.html)
* 安装 [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)

## 运行 playground

```bash
cd ios/playground
pod install
```

* 在 `Xcode` 中打开  `WeexDemo.xcworkspace`
* 点击 <img src="https://gw.alicdn.com/L1/461/1/5470b677a2f2eaaecf412cc55eeae062dbc275f9" height="16" > (`Run` 按钮) 或者使用快捷键 `cmd + r `运行 

## 运行 Rax Examples

以 Rax 官方 [Examples](https://github.com/alibaba/rax/tree/master/examples) 为例：

### 启动Demo

```bash
git clone https://github.com/alibaba/rax.git
cd rax
npm install
npm run setup
npm start
```

### 修改 bundle 地址

* 打开 `ios/playground/WeexDemo/DemoDefine.h`

* 按需改变 `HOME_URL` 的值

![](https://img.alicdn.com/tfs/TB1bR8CQFXXXXXWXFXXXXXXXXXX-1828-594.png)

* 点击 <img src="https://img.alicdn.com/L1/461/1/5470b677a2f2eaaecf412cc55eeae062dbc275f9" height="16" > (`Run` 按钮) 或者使用快捷键 `cmd + r` 运行

## 调试

顺利在 `Simulator` 中打开测试 Demo 后，可通过 Safari 的开发面板进行调试

![](https://img.alicdn.com/tfs/TB191o9QpXXXXczaXXXXXXXXXXX-1708-382.png)